import axios from "axios";
import { Router } from "express";
import { ResponseFilters } from "../types";
import { matchesFilters } from "../utils/filter";

interface FilloutResponse {
  questions: { id: string; name: string; type: string; value: string | number }[];
  totalResponses: number;
  pageCount: number;
}

const router = Router()

router.get('/:formId/filteredResponses', async (req, res) => {
  const { formId } = req.params;
  const { page, limit, ...filters } = req.query as { page?: string; limit?: string; filters?: string };

  // Prepare filter query string
  let parsedFilters: ResponseFilters = [];

  if (filters.filters) {
    try {
      parsedFilters = JSON.parse(filters.filters);
    } catch (error) {
      console.error('Error parsing filters:', error);
      return res.status(400).send({ message: 'Invalid filters format' });
    }
  }

  const url = `https://api.fillout.com/v1/api/forms/${formId}`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.API_KEY}`,
  };

  try {
    const response = await axios.get<FilloutResponse>(url, { headers });

    
    const filteredResponses = response.data.questions.filter(r => matchesFilters(r, parsedFilters));
    
    const pageStr: string = page || '1'; // Default to page 1 if not provided
    const limitStr: string = limit || '10'; // Default to limit of 10 if not provided

    const pageNum = parseInt(pageStr, 10);
    const limitNum = parseInt(limitStr, 10);
    const paginatedResponses = filteredResponses.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    // Adjusting the totalResponses and pageCount based on the filtered data
    const totalResponses = filteredResponses.length;
    const pageCount = Math.ceil(totalResponses / limitNum);

    res.json({
      responses: paginatedResponses,
      totalResponses,
      pageCount,
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).send({ message: 'Error fetching responses' });
  }
});

export default router;