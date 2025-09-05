import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routeConfig } from './routes'

// Helper function to render routes recursively
const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    const key = route.path || route.index || index

    if (route.children) {
      // This is a layout route with children
      return (
        <Route key={key} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      )
    }

    // Regular route
    if (route.index) {
      return <Route key={key} index element={route.element} />
    }

    return <Route key={key} path={route.path} element={route.element} />
  })
}

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {renderRoutes(routeConfig)}
      </Routes>
    </Router>
  )
}

export default AppRouter
