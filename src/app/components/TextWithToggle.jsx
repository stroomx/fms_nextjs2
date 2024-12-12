'use client';

import { useState } from 'react';

export default function TextWithToggle({ description, maxLength = 500, showtext = false }) {
  const [isExpanded, setIsExpanded] = useState(false);  // State to toggle description visibility

  // Function to handle the "Show More" button click
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // Truncate description if it's longer than maxLength
  const truncatedDescription =
    description?.length > maxLength ? description?.slice(0, maxLength) + (showtext ? '...' : '') : description;

  return (
    <>
      {isExpanded ? description : truncatedDescription}

      {/* Only show "Show More" button if the description is longer than maxLength */}
      {description?.length > maxLength && (<>{' '}
        <a onClick={toggleDescription} className={`text-blue cursor-pointer ${showtext ? 'text-decoration-underline' : ''} font-italic`}>
          {isExpanded ? 'read less' : (showtext ? 'read more' : '...')}
        </a></>
      )}
    </>
  );
}
