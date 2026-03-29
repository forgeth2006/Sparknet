import React from 'react';
import { useLocation } from 'react-router-dom';
import OAuthError from '../../components/auth/OAuthError';

export default function OAuthErrorPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const message = params.get('message');
  return <OAuthError message={message} />;
}
