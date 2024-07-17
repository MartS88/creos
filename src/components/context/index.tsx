import { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useCallback, useRef } from 'react';
import { Designer } from '../../types/designer.ts';
import { useLazyGetDesignersQuery } from '../../service/api.ts';

interface AuthContextType {
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  locale: string;
  setLocale: (value: string) => void;
  theme: string;
  setTheme: (value: string) => void;
  allDesigners: Designer[];
  fetchLoading: boolean;
  isError: boolean;
}

const defaultValue: AuthContextType = {
  isLoading: false,
  setLoading: () => {},
  locale: 'RU',
  setLocale: () => {},
  theme: 'light',
  setTheme: () => {},
  allDesigners: [],
  fetchLoading: true,
  isError: false,
};

export const AuthContext = createContext<AuthContextType>(defaultValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [locale, setLocale] = useState<string>('RU');
  const [theme, setTheme] = useState<string>('light');
  const [allDesigners, setAllDesigners] = useState<Designer[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [fetchDesigners, { isError }] = useLazyGetDesignersQuery();
  const hasFetched = useRef(false);

  const fetchAllPages = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    let allResults: Designer[] = [];
    const totalPages = 16;

    try {
      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const response = await fetchDesigners(currentPage).unwrap();
        allResults = allResults.concat(response.results);
      }
      setAllDesigners(allResults);
    } catch (error) {
      console.error("Error fetching designers:", error);
    } finally {
      setFetchLoading(false);
    }
  }, [fetchDesigners]);

  useEffect(() => {
    fetchAllPages();
  }, [fetchAllPages]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#312e2e';
    } else if (theme === 'light') {
      document.body.style.backgroundColor = 'white';
    }
  }, [theme]);

  return (
    <AuthContext.Provider value={{
      isLoading,
      setLoading,
      locale,
      setLocale,
      theme,
      setTheme,
      allDesigners,
      fetchLoading,
      isError
    }}>
      {children}
    </AuthContext.Provider>
  );
};
