import ProfileService from "../services/profileService.js";

class profileController {
    async getProfile(req, res) {
        try {
            const username = req.user.username;
            const userProfile = await ProfileService.getProfile(username);
            if (!userProfile) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(userProfile);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

const ProfileController = new profileController();
export default ProfileController;