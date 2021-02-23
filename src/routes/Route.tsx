import React, { useCallback } from 'react';
import {
  RouteProps as ReactRouterDOMProps,
  Route as ReactRouterDOMRoute,
  Redirect
} from 'react-router-dom';

import { useAuth } from '../hooks/Auth';

interface RouteProps extends ReactRouterDOMProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({ isPrivate = false, component: Component, ...rest }) => {
  const { user } = useAuth();

  /**
   *  isPrivate | isSigned | Resultado
   *  true      | true     | Prossegue
   *  true      | false    | Redireciona pro login
   *  false     | true     | Redireciona pro dashboard
   *  false     | false    | Prossegue
   */
  const handleRender = useCallback((location) => {
    const isSigned = !!user;

    return isPrivate === isSigned
      ? <Component />
      : (
        <Redirect to={{
          pathname: isPrivate ? '/' : '/dashboard',
          state: { from: location }
        }} />
      )
  }, [isPrivate, user, Component]);

  return (
    <ReactRouterDOMRoute
      {...rest}
      render={({ location }) => handleRender(location)}
    />
  );
}

export default Route;
