import profileIcon from '/profileIcon.jpeg';


const getCommenterImage = (user) => {
  if (!user) return "/default-avatar.png";

  const img = user.image;

  if (!img) return "/default-avatar.png";

  // handle empty strings or broken URLs
  if (typeof img !== "string" || img.trim() === "") {
    return "/default-avatar.png";
  }

  return img;
};

export default getCommenterImage;

