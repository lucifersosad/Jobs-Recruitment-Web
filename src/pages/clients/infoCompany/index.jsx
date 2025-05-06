import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompany } from "../../../services/clients/employersApi";
import { getPostComments, checkEmployerPostsLikeStatus, checkLikedStatus } from "../../../services/clients/postApi";
import { decData } from "../../../helpers/decData";
import "./infoCompany.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

// Components
import CompanyHeader from "./components/CompanyHeader";
import TabNavigation from "./components/TabNavigation";
import IntroductionCard from "./Introduction/IntroductionCard";
import JobsCard from "./Jobs/JobsCard";
import PostsCard from "./Posts/PostsCard";
import ContactCard from "./Contact/ContactCard";
import ShareCard from "./Share/ShareCard";
import RelatedCompanies from "./components/RelatedCompanies";

// Utils
import { handleAddress, handleNumberOfWorkers } from "./utils/companyUtils";
import { fetchPostsData, fetchPostComments, checkPostLikedStatus } from "./utils/postUtils";

function InfoCompany() {
  const [currentPath] = useState(window.location);
  const [location, setLocation] = useState([0, 0]);
  const { slug } = useParams();
  const [recordItem, setRecordItem] = useState([]);
  const [employersWithJobCounts, setEmployersWithJobCounts] = useState([]);
  const [activeTab, setActiveTab] = useState('intro');
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const authUser = useSelector((state) => state.authenticationReducerClient?.infoUser);

  useEffect(() => {
    const fetchCompanyData = async () => {
      const result = await getCompany(slug);
      if (result.code !== 200) return;

      const dectDataConvert = decData(result.data);
      console.log("Thông tin công ty:", dectDataConvert);
      
      const locationCoords = await handleAddress(dectDataConvert);
      setLocation(locationCoords);
      
      handleNumberOfWorkers(dectDataConvert);
      setRecordItem(dectDataConvert);
      setEmployersWithJobCounts(result.employersWithJobCounts);
    };

    fetchCompanyData();
  }, [slug]);

  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
    
    if (activeTab === 'posts' && recordItem?.slug) {
      fetchPosts();
    }
  }, [activeTab, recordItem]);

  const fetchPosts = async () => {
    setPostsLoading(true);
    setPostsError(null);
    
    const employerId = recordItem?._id || recordItem?.slug;
    if (!employerId) {
      setPostsError("Không thể tải bài viết: Thiếu thông tin công ty");
      setPostsLoading(false);
      return;
    }
    
    try {
      // Set initial posts data
      const handlePostsSuccess = (postsData) => {
        setPosts(postsData);
        
        // Fetch comments for each post
        postsData.forEach(async (post) => {
          if (post.id) {
            const comments = await fetchPostComments(post.id);
            if (comments) {
              setPosts(prevPosts => 
                prevPosts.map(p => 
                  p.id === post.id ? { ...p, comments } : p
                )
              );
            }
          }
        });
      };
      
      const handlePostsError = (errorMessage) => {
        setPostsError(errorMessage);
      };
      
      // Fetch posts and get like status
      const likeStatusData = await fetchPostsData(
        employerId, 
        handlePostsSuccess, 
        handlePostsError
      );
      
      // Update posts with like status if available
      if (likeStatusData) {
        setPosts(prevPosts => 
          prevPosts.map(post => ({
            ...post,
            isLiked: likeStatusData[post.id] === true
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPostsError("Lỗi khi tải bài viết");
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchPostDetails = async (postId) => {
    if (!postId) return;
    
    try {
      // Check like status
      const likeStatus = await checkPostLikedStatus([postId]);
      if (likeStatus && typeof likeStatus[postId] === 'boolean') {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId ? { ...post, isLiked: likeStatus[postId] } : post
          )
        );
      }
      
      // Fetch comments
      const comments = await fetchPostComments(postId);
      if (comments) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId ? { ...post, comments } : post
          )
        );
      }
    } catch (err) {
      console.error(`Error fetching details for post ${postId}:`, err);
    }
  };

  const refreshAllPosts = async () => {
    if (posts.length === 0 || !recordItem?.slug) return;
    console.log("Refreshing all posts data");
    
    try {
      const employerId = recordItem?._id || recordItem?.slug;
      const likeStatusResult = await checkEmployerPostsLikeStatus(employerId);
      
      if (likeStatusResult?.code === 200 && likeStatusResult.data) {
        console.log("Refreshed all posts like status");
        setPosts(prevPosts => 
          prevPosts.map(post => ({
            ...post,
            isLiked: likeStatusResult.data[post.id] === true
          }))
        );
      }
      
      // Refresh comments for all posts
      for (const post of posts) {
        if (post.id) {
          const comments = await fetchPostComments(post.id);
          if (comments) {
            setPosts(prevPosts => 
              prevPosts.map(p => 
                p.id === post.id ? { ...p, comments } : p
              )
            );
          }
        }
      }
      
      showNotification('Đã cập nhật dữ liệu bài viết', 'info');
    } catch (error) {
      console.error("Error refreshing all posts:", error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <div className="cb-section cb-section-padding-bottom bg-grey2">
      <div className="container">
        <div className="full-info-company">
          <CompanyHeader companyData={recordItem} />

          <div className="row">
            <div className="col-md-8">
              <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === 'intro' && (
                <IntroductionCard companyData={recordItem} />
              )}

              {activeTab === 'jobs' && (
                <JobsCard slug={recordItem?.slug} />
              )}

              {activeTab === 'posts' && (
                <PostsCard 
                  posts={posts}
                  postsLoading={postsLoading}
                  postsError={postsError}
                  companyData={recordItem}
                  onRefresh={refreshAllPosts}
                  onFetchPostDetails={fetchPostDetails}
                />
              )}

              {employersWithJobCounts.length > 0 && (
                <RelatedCompanies companies={employersWithJobCounts} />
              )}
            </div>
            <div className="col-md-4">
              <ContactCard companyData={recordItem} mapLocation={location} />
              <ShareCard currentPath={currentPath} />
            </div>
          </div>
        </div>
      </div>

      {notification.show && (
        <div className={`toast-notification ${notification.type}`}>
          {notification.type === 'success' && <FontAwesomeIcon icon={faCheckCircle} className="icon" />}
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default InfoCompany; 