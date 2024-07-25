import AccountService from "../services/accountService.js";

class accountController {
    async SignUp(req, res) {
        const { name, email, phone, username, password} = req.body;

        // console.log("Received data:", { name, email, phone, username, password });

        try {
            const newUser = await AccountService.signUp(name, email, phone, username, password);

            res.status(201).json({
                message: 'User registered successfully',
                data: newUser
            });
        } catch (error) {
            res.status(500).json({
                message: 'An error occurred while registering the user',
                error: error.message
            });
        }
    }

    async SignIn(req, res) {
        const { username, password } = req.body;
        // console.log("Received data:", { username });

        try {
            const user = await AccountService.signIn(username, password);

            if (user) {
                res.status(200).json(user);
            } else {
                res.status(401).json({
                    message: 'Invalid username or password'
                });
            }
        } catch (error) {
            res.status(500).json({
                message: 'An error occurred during authentication',
                error: error.message
            });
        }
    }

    async VerifyToken(req, res) {
        res.status(200).json({ valid: true });
    }
}

const AccountController = new accountController()
export default AccountController;
