import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next";

interface DecodedToken {
  // Add the expected properties of your decoded token here
  exp: number;
  // ... other properties
}

export function useDecodedToken() {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodedToken(decoded);
      } catch (error) {
        setDecodedToken(null);
      }
    } else {
      setDecodedToken(null);
    }
  }, []);

  return decodedToken;
}
