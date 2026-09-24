import { APIRequestContext } from '@playwright/test';

const API_URL = 'https://conduit-api.bondaracademy.com/api';

export async function login(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<string> {
  const response = await request.post(`${API_URL}/users/login`, {
    data: {
      user: {
        email,
        password,
      },
    },
  });

  if (!response.ok()) {
    throw new Error(
      `API login failed: ${response.status()} ${response.url()}`
    );
  }

  const body = await response.json();

  return body.user.token;
}

export async function deleteArticle(
  request: APIRequestContext,
  token: string,
  slug: string
): Promise<void> {
  const response = await request.delete(
    `${API_URL}/articles/${slug}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok()) {
    throw new Error(
      `Article deletion failed: ${response.status()} ${response.url()}`
    );
  }
}