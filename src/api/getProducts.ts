import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://stageapi.monkcommerce.app/task",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "72njgfa948d9aS7gs5",
  },
});

export async function getProducts({
  pageParam,
  searchQuery,
}: {
  pageParam: number;
  searchQuery: string;
}) {
  try {
    const res = await apiClient.get(`/products/search`, {
      params: {
        search: searchQuery,
        page: pageParam,
        limit: 10,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
