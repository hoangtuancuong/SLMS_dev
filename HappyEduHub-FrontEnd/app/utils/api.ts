import { Course, Member } from './api_model';
import { PaginationResponse } from './api_response';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://9550-113-22-156-245.ngrok-free.app';

export const APIS = {
  getCourses: async (params: {
    limit: number;
    offset: number;
  }): Promise<PaginationResponse<Course>> => {
    const headers = {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    const queryString = new URLSearchParams({
      limit: params.limit.toString(),
      offset: params.offset.toString(),
    }).toString();
    const url = `${API_URL}/courses${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url, { method: 'GET', headers });
    const data = response.headers
      .get('content-type')
      ?.includes('application/json')
      ? await response.json()
      : null;
    if (!response.ok)
      throw new Error(data?.message || `HTTP error ${response.status}`);
    return data;
  },

  getCourseById: async (courseId: string | number): Promise<Course> => {
    const headers = {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    const url = `${API_URL}/courses/${courseId}`;
    const response = await fetch(url, { method: 'GET', headers });
    const data = response.headers
      .get('content-type')
      ?.includes('application/json')
      ? await response.json()
      : null;
    if (!response.ok)
      throw new Error(data?.message || `HTTP error ${response.status}`);
    return data;
  },

  getMembersByCourseId: async (
    courseId: number,
    params: {
      limit: number;
      offset: number;
      filter?: {
        role: string;
      };
    }
  ): Promise<PaginationResponse<Member>> => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    const query: any = {
      limit: params.limit.toString(),
      offset: params.offset.toString(),
    };
    if (params.filter?.role) query['filter[role]'] = params.filter.role;
    const queryString = new URLSearchParams(query).toString();
    const url = `${API_URL}/courses/${courseId}/members?${queryString}`;
    const response = await fetch(url, { method: 'GET', headers });
    const data = response.headers
      .get('content-type')
      ?.includes('application/json')
      ? await response.json()
      : null;
    if (!response.ok)
      throw new Error(data?.message || `HTTP error ${response.status}`);
    return data;
  },
};

export async function callApi(
  endpoint,
  method = 'GET',
  body = null,
  params = {}
) {
  const headers = {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": "true",
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/${endpoint}${queryString ? '?' + queryString : ''}`;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const isJson = response.headers
      .get('content-type')
      ?.includes('application/json');

    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.message || `HTTP error ${response.status}`);
    }

    return data || { status: response.status };
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}

export async function callUploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const url = `${API_URL}/drive/upload`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || `HTTP error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('File Upload Error:', error.message);
    throw error;
  }
}
