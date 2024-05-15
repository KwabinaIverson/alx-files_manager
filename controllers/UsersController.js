import dbClient from '../utils/db';
import sha1 from 'sha1';
import Queue from 'bull';

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UserController {
    static postNew(request, response) {
        const { email } = request.body;
        const { password } = request.body;

        if (!email) {
            response.status(400).json({ error: 'Missing email' });
            return;
        }
        if (!password) {
            response.status(400).json({ error: 'Missing password' });
            return;
        }

        const users = dbClient.db.collection('users');
        users.findOne({ email }, (err, user) => {
            if (user) {
                response.status(400).json({ error: 'Already exit' });
            } else {
                const hashedPassword = sha1(password);
                users.insertOne({
                    email,
                    password: hashedPassword
                }).then((result) => {
                    response.status(201).json({ id: result.insertedId, email });
                    userQueue.add({ userId: result.insertedId });
                }).catch((err) => console.log(err));
            }
        });
    }
}

module.exports = UserController;