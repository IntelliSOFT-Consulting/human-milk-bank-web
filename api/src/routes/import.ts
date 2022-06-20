// Import only what we need from express
import { Router, Request, Response } from 'express';

// Assign router to the express.Router() instance
const router: Router = Router();

// The / here corresponds to the route that the WelcomeController
// is mounted on in the server.ts file.
// In this case it's /welcome

router.get('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;

    // Greet the given name
    // res.send(`Hello, ${name}`);
});

// Export the express.Router() instance to be used by server.ts
export default router;
