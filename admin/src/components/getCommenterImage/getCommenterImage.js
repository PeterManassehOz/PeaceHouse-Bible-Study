/*import profileIcon from '/profileIcon.jpeg'; // Default profile image

const getCommenterImage = (user) => {
  if (!user?.image) return profileIcon;

  // Ensure the path is correct
  const imageUrl = user.image.startsWith("http")
    ? user.image
    : `http://localhost:5000/${user.image.replace(/^src\//, '')}`; // Remove "src/" prefix

  return `${imageUrl}?t=${new Date().getTime()}`;
};


export default getCommenterImage;
*/


import profileIcon from '/profileIcon.jpeg';


const getCommenterImage = (user) => {
  if (!user?.image) return profileIcon; // If there's no image, return default

  const timestamp = new Date().getTime();
  return `http://localhost:5000/${user.image.replace(/^src\//, '')}?t=${timestamp}`; // Otherwise, return the constructed URL
};

export default getCommenterImage;

