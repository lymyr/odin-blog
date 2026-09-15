# todo: revise

## details

### backend
- JWT (isAdmin.js middleware)
- Validations and error handling
- Serving 2 clients with cors (will update once i deploy clients)
- Script to set admin username and password
- Versioned RESTful api design


### Frontend
- **Admin:** Attached JWT to localStorage and sent it as `Authorization: Bearer <token>` on headers
- **Admin:** Redirects to login if there is no JWT in localStorage or `JsonWebTokenError`
- `useContext` to avoid prop drilling
- Backend validation error display
- Made it quick and simple as I'm focused on the backend
- Went monkey mode for code structure lol