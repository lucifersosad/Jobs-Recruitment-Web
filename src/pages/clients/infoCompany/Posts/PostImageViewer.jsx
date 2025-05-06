import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faArrowLeft,
  faArrowRight,
  faExpand
} from "@fortawesome/free-solid-svg-icons";

function PostImageViewer({ postId, images, imageViewer, setImageViewer }) {
  const validImages = images?.filter(img => img && img.trim() !== '') || [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imageViewer.visible || imageViewer.postId !== postId) return;

      switch (e.key) {
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case 'Escape':
          closeImageViewer();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imageViewer, postId]);

  const openImageViewer = (index = 0) => {
    if (validImages.length === 0) return;

    console.log("Opening image viewer for post:", postId);
    console.log("Images:", validImages);
    console.log("Starting at index:", index);

    setImageViewer({
      postId,
      visible: true,
      images: validImages,
      currentIndex: index >= validImages.length ? 0 : index
    });
  };

  const closeImageViewer = () => {
    console.log("Closing image viewer");
    setImageViewer(prev => ({ ...prev, visible: false }));
    
    setTimeout(() => {
      setImageViewer({
        postId: null,
        visible: false,
        images: [],
        currentIndex: 0
      });
    }, 300);
  };

  const navigateImage = (direction) => {
    const { images, currentIndex } = imageViewer;
    let newIndex;

    if (direction === 'next') {
      newIndex = currentIndex + 1 >= images.length ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
    }

    console.log(`Navigating ${direction} from index ${currentIndex} to ${newIndex}`);
    setImageViewer({ ...imageViewer, currentIndex: newIndex });
  };

  if (validImages.length === 0) {
    return null;
  }

  if (imageViewer.visible && imageViewer.postId === postId) {
    return (
      <div className="inline-image-viewer">
        <div className="image-viewer-container">
          <button
            className="close-viewer"
            onClick={(e) => {
              e.stopPropagation();
              closeImageViewer();
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          
          <div className="image-display">
            {imageViewer.images[imageViewer.currentIndex] && (
              <img
                src={imageViewer.images[imageViewer.currentIndex]}
                alt={`Ảnh ${imageViewer.currentIndex + 1}`}
              />
            )}
          </div>

          {validImages.length > 1 && (
            <>
              <button
                className="nav-button prev"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <button
                className="nav-button next"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </>
          )}

          <div className="image-counter">
            {imageViewer.currentIndex + 1} / {validImages.length}
          </div>
        </div>
      </div>
    );
  }

  if (validImages.length === 1) {
    return (
      <div className="post-images single-image">
        <div className="image-wrapper">
          <img
            src={validImages[0]}
            alt="Post image"
            onClick={() => openImageViewer(0)}
          />
          <div className="hover-overlay" onClick={() => openImageViewer(0)}>
            <FontAwesomeIcon icon={faExpand} />
          </div>
        </div>
      </div>
    );
  } else if (validImages.length === 2) {
    return (
      <div className="post-images">
        <div className="image-grid grid-2">
          {validImages.map((image, index) => (
            <div
              key={index}
              className="image-item"
              onClick={() => openImageViewer(index)}
            >
              <img src={image} alt={`Post ${index + 1}`} />
              <div className="hover-overlay">
                <FontAwesomeIcon icon={faExpand} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (validImages.length >= 3) {
    return (
      <div className="post-images">
        <div className="image-grid grid-3">
          {validImages.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className={`image-item ${index === 2 && validImages.length > 3 ? 'has-overlay' : ''}`}
              onClick={() => openImageViewer(index)}
            >
              <img src={image} alt={`Post ${index + 1}`} />
              {index === 2 && validImages.length > 3 && (
                <div className="overlay-count">
                  +{validImages.length - 3}
                </div>
              )}
              <div className="hover-overlay">
                <FontAwesomeIcon icon={faExpand} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default PostImageViewer; 