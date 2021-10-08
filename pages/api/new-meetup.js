import { MongoClient } from 'mongodb';
/**
 * POST - create new meetup
 * @param {*} req
 * @param {*} res
 */
const handler = async (req, res) => {
  if (req.method === 'POST') {
    const data = req.body;

    const client = await MongoClient.connect(
      'mongodb+srv://carmelo:Chelomelo01@cluster0.0eojp.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupCollection = db.collection('meetups');

    const result = await meetupCollection.insertOne(data);

    client.close();

    res.status(201).json({
      message: 'Meetup inserted successfully.',
    });
  }
};

export default handler;
