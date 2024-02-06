import { NextApiRequest, NextApiResponse } from 'next';

const processedData = fetch("../data/processed_data_new.json")
.then((response) => {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
})
.then((data) => {
})
.catch((error) => {
  console.error("Error fetching data:", error);
});

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(processedData);
};

export default handler;