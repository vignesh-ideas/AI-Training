# HMS Frontend

Hospital Management System Frontend - React TypeScript Application

## 🚀 Features Implemented

### ✅ FE-001: User Authentication (COMPLETED)
- **Login Form**: Material-UI based login form with validation
- **JWT Token Management**: Secure token storage and automatic token validation
- **Protected Routes**: Role-based route protection with automatic redirects
- **User Context**: React Context for global authentication state management
- **Remember Me**: Persistent login functionality
- **Form Validation**: Comprehensive client-side validation using Yup
- **Error Handling**: Toast notifications for user feedback
- **Loading States**: Proper loading indicators during authentication

## 🛠 Tech Stack

- **React 18+** with TypeScript
- **Material-UI (MUI) v5** for UI components
- **React Router v6** for routing
- **React Hook Form** with Yup validation
- **Redux Toolkit** for state management
- **React Query** for server state management
- **Axios** for HTTP requests
- **React Hot Toast** for notifications
- **Vite** for build tooling

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       ├── ProtectedRoute.tsx
│   │       └── __tests__/
│   ├── pages/
│   │   └── LoginPage.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── authService.ts
│   ├── types/
│   │   └── auth.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm 8+

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build
```bash
npm run build
```

### Testing
```bash
npm test
npm run test:coverage
```

## 🔐 Authentication Features

### Login Form
- Username/password authentication
- Form validation with error messages
- Password visibility toggle
- Remember me functionality
- Loading states during authentication
- Error handling with toast notifications

### Registration Form
- Role-based registration (Doctor, Nurse, Patient, Pharmacist, Lab Technician)
- Password strength indicator
- Comprehensive form validation
- Password confirmation
- Real-time validation feedback

### Protected Routes
- Automatic authentication checks
- Role-based access control
- Loading states during auth checks
- Automatic redirects for unauthorized access
- Access denied messages for insufficient permissions

### JWT Token Management
- Secure token storage in localStorage
- Automatic token validation on app load
- Token refresh handling
- Automatic logout on token expiration
- Interceptor for adding auth headers

## 🎨 UI/UX Features

### Material-UI Theme
- Custom healthcare-themed color palette
- Responsive design
- Accessibility features
- Consistent component styling

### Form Validation
- Real-time validation feedback
- Password strength indicators
- Input sanitization
- Error message display

### Loading States
- Skeleton loaders
- Progress indicators
- Disabled states during operations
- Smooth transitions

### Error Handling
- Toast notifications
- Form error messages
- Network error handling
- User-friendly error messages

## 🔧 Configuration

### Environment Variables
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Feature Flags
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_REMEMBER_ME=true
```

### API Integration
The frontend integrates with the HMS backend microservices:
- **User Service**: Authentication and user management
- **Patient Service**: Patient data management
- **Appointment Service**: Appointment scheduling
- **Medical Records Service**: Medical records management
- **And more...**

## 🧪 Testing

### Unit Tests
- Component testing with React Testing Library
- Hook testing
- Service testing
- Utility function testing

### Test Coverage
- Login form validation
- Protected route functionality
- Authentication flow
- Error handling

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen sizes

## 🔒 Security Features

- JWT token-based authentication
- Secure token storage
- Automatic token validation
- Role-based access control
- Input sanitization
- CSRF protection
- XSS prevention

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📋 Next Steps

### Upcoming Features
- **FE-002**: User Registration (in progress)
- **FE-003**: User Profile Management
- **FE-004**: Admin User Management
- **FE-005**: Patient Registration
- **FE-006**: Patient Profile & Search
- **FE-007**: Patient Dashboard

### Planned Enhancements
- Real-time notifications
- Chat functionality
- File upload capabilities
- Advanced search features
- Analytics dashboard
- Mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation
- Review the troubleshooting guide 