const renderAvatar = () => {
  // Trước khi sửa
  return (
    <>
      {isCompanyReply || 
        replyUserId === 'company' || 
        replyUserId === companyInfo.id || 
        (post.companyId && replyUserId === post.companyId) ||
        (post.employerId && replyUserId === post.employerId) ||
        reply.isCompanyComment === true || 
        replyUserName === companyInfo.name ? (
        <img
          src={replyUserAvatar}
          alt={`${replyUserName} Avatar`}
          className="w-7 h-7 rounded-full border border-gray-200"
          onError={(e) => {
            if (e.target.src !== DEFAULT_AVATAR) {
              e.target.src = DEFAULT_AVATAR;
            }
            e.target.onerror = null; // Tránh vòng lặp vô hạn
          }}
        />
      ) : (
        <a 
          href={`/profile/${replyUserId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <img
            src={replyUserAvatar}
            alt={`${replyUserName} Avatar`}
            className="w-7 h-7 rounded-full border border-gray-200"
            onError={(e) => {
              if (e.target.src !== DEFAULT_AVATAR) {
                e.target.src = DEFAULT_AVATAR;
              }
              e.target.onerror = null; // Tránh vòng lặp vô hạn
            }}
          />
        </a>
      )}
    </>
  );
};

const renderFixedAvatar = () => {
  return (
    <>
      <img
        src={replyUserAvatar}
        alt={`${replyUserName} Avatar`}
        className="w-7 h-7 rounded-full border border-gray-200"
        onError={(e) => {
          if (e.target.src !== DEFAULT_AVATAR) {
            e.target.src = DEFAULT_AVATAR;
          }
          e.target.onerror = null; // Tránh vòng lặp vô hạn
        }}
      />
    </>
  );
};

const renderName = () => {
  return (
    <>
      {isCompanyReply || 
        replyUserId === 'company' || 
        replyUserId === companyInfo.id || 
        (post.companyId && replyUserId === post.companyId) ||
        (post.employerId && replyUserId === post.employerId) ||
        reply.isCompanyComment === true || 
        replyUserName === companyInfo.name ? (
        <>
          {replyUserName}
          <span className="ml-1 text-xs text-blue-500">(Công ty)</span>
        </>
      ) : (
        <a 
          href={`/profile/${replyUserId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 cursor-pointer"
        >
          {replyUserName}
        </a>
      )}
    </>
  );
};

const renderFixedName = () => {
  return (
    <>
      {isCompanyReply || 
        replyUserId === 'company' || 
        replyUserId === companyInfo.id || 
        (post.companyId && replyUserId === post.companyId) ||
        (post.employerId && replyUserId === post.employerId) ||
        reply.isCompanyComment === true || 
        replyUserName === companyInfo.name ? (
        <>
          {replyUserName}
          <span className="ml-1 text-xs text-blue-500">(Công ty)</span>
        </>
      ) : (
        <span className="text-gray-800">
          {replyUserName}
        </span>
      )}
    </>
  );
}; 