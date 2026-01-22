import { BlogArticle, SocialPost } from './types';

export function generateSocialPosts(article: BlogArticle): SocialPost[] {
  const { title, url, description, author } = article;
  
  // Clean up description for posts
  const shortDesc = description.length > 100 
    ? description.substring(0, 100).trim() + '...'
    : description;
  
  const fullDesc = description.length > 200
    ? description.substring(0, 200).trim() + '...'
    : description;

  // LinkedIn - Professional, longer format
  const linkedinPost: SocialPost = {
    platform: 'linkedin',
    content: `${title}

${fullDesc}

${author !== 'Checkit' ? `Written by ${author} | ` : ''}Read the full article on the Checkit blog.

${url}

#OperationalExcellence #DigitalTransformation #Checkit`,
  };

  // Facebook - Conversational, engaging
  const facebookPost: SocialPost = {
    platform: 'facebook',
    content: `New on the Checkit blog: ${title}

${shortDesc}

Read more: ${url}`,
  };

  // Twitter/X - Concise, under 280 chars
  const twitterContent = `${title}

${shortDesc}

${url}`;
  
  // Ensure Twitter post is under 280 characters
  const twitterPost: SocialPost = {
    platform: 'twitter',
    content: twitterContent.length > 280 
      ? `${title.substring(0, 100)}...

${url}`
      : twitterContent,
  };

  return [linkedinPost, facebookPost, twitterPost];
}
