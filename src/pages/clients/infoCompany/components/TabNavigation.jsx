function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="company-tabs">
      <div
        className={`tab-item ${activeTab === 'intro' ? 'active' : ''}`}
        onClick={() => setActiveTab('intro')}
      >
        Giới thiệu công ty
      </div>
      <div
        className={`tab-item ${activeTab === 'jobs' ? 'active' : ''}`}
        onClick={() => setActiveTab('jobs')}
      >
        Tuyển dụng
      </div>
      <div
        className={`tab-item ${activeTab === 'posts' ? 'active' : ''}`}
        onClick={() => setActiveTab('posts')}
      >
        Bài viết
      </div>
    </div>
  );
}

export default TabNavigation; 