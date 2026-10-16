import {
    IoLogoGithub,
    IoLogoLinkedin,
    IoLogoMedium,
    IoLogoYoutube,
    IoLogoStackoverflow,
    IoMail,
    IoGlobeOutline
} from 'react-icons/io5';
import { FaXTwitter } from 'react-icons/fa6';

const icons = {
    github: IoLogoGithub,
    linkedin: IoLogoLinkedin,
    x: FaXTwitter,
    email: IoMail,
    medium: IoLogoMedium,
    youtube: IoLogoYoutube,
    stackoverflow: IoLogoStackoverflow,
    website: IoGlobeOutline
};

const SocialIcon = ({ platform }) => {
    const Icon = icons[platform] || IoGlobeOutline;
    return <Icon />;
};

export default SocialIcon;
