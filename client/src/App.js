import React, {useEffect, lazy, Suspense} from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';

import { GlobalStyles } from "./global.styles";

import Header from "./components/header/header.component";
import Spinner from "./components/spinner/spinner.component";
import ErrorBoundary from "./components/error-boundary/error-boundary.component";

import { checkUserSession } from "./redux/user/user.actions";
import { selectCurrentUser } from './redux/user/user.selectors';

const HomePage = lazy(() => import('./pages/homepage/homepage.component'));
const ShopPage = lazy(() => import('./pages/shop/shop.component'));
const CheckoutPage = lazy(() => import('./pages/checkout/checkout.component'));
const Auth = lazy(() => import('./pages/auth/auth.component'));

const App = ({currentUser, checkUserSession}) => {
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession])

  return (
    <div>
      <GlobalStyles />
      <Header />
      <Switch>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Route exact={true} path={'/'} component={HomePage}/>
            <Route path={'/shop'} component={ShopPage}/>
            <Route exact path='/checkout' component={CheckoutPage} />
            <Route
              exact={true}
              path={'/auth'}
              render={() => currentUser ?
                <Redirect to={'/'} />
                :
                <Auth />
              }/>
          </Suspense>
        </ErrorBoundary>
      </Switch>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  checkUserSession: () => dispatch(checkUserSession()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
