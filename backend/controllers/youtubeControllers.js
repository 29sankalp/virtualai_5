import axios from "axios";

export const playYoutube = async (req, res) => {
  try {

    const { query } = req.body;

    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    const response = await axios.get(url);

    const html = response.data;

    const match = html.match(/"videoId":"(.*?)"/);

    if (!match) {
      return res.json({ videoUrl: null });
    }

    const videoId = match[1];

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    res.json({ videoUrl });

  } catch (error) {
    console.log(error);
    res.status(500).json({ videoUrl: null });
  }
};