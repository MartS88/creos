import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CommentResponse } from '../types/comment.ts';
import { DesignerResponse } from '../types/designer.ts';
import { IssueResponse } from '../types/issue.ts';
import { ProjectResponse } from '../types/project.ts';

const baseUrl = 'https://sandbox.creos.me/';

export const api = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  endpoints: (builder) => ({
    getComments: builder.query<CommentResponse[], void>({
      query: () => `api/v1/comment/`,
    }),
    GetDesigners: builder.query<DesignerResponse, number | void>({
      query: (page = 1) => `api/v1/designer/?page=${page}`,
    }),
    GetIssues: builder.query<IssueResponse[], void>({
      query: () => `api/v1/issue/`,
    }),
    GetProjects: builder.query<ProjectResponse[], void>({
      query: () => `api/v1/project/`,
    }),

  }),
});

export const {
  useGetCommentsQuery,
  useLazyGetDesignersQuery,
  useGetIssuesQuery,
  useGetProjectsQuery,
}
  = api;
