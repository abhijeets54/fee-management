# Student Fee Management System

A modern, full-stack web application for managing student fee payments with real-time updates, secure authentication, and payment simulation.

## 🚀 Features

- **Secure Authentication**: User registration and login with Supabase Auth
- **Student Management**: View all students and their payment status
- **Profile Management**: Students can view and edit their personal information
- **Payment Simulation**: Secure payment processing simulation
- **Real-time Updates**: Live synchronization across all pages using Supabase real-time
- **Payment History**: Track all payment transactions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion for animations
- **Backend**: Supabase (Database, Authentication, Real-time)
- **UI Components**: Custom components with shadcn/ui patterns
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd student-fee-management
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL script to create tables and set up Row Level Security

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 6. Verify Setup

Visit [http://localhost:3000/setup](http://localhost:3000/setup) to check if your database is properly configured.

## 📱 Application Flow

### 1. Home Page
- Landing page with feature overview
- Navigation to All Students or Login

### 2. Authentication
- **Sign Up**: Create new student account
- **Sign In**: Login to existing account
- Automatic redirect to profile after successful authentication

### 3. All Students Page
- Public view of all registered students
- Real-time updates of payment status
- Search and filter functionality
- Payment status indicators

### 4. Profile Page (Protected)
- View and edit personal information
- Check fee payment status
- Access to payment portal
- View payment history

### 5. Payment Page (Protected)
- Secure payment form simulation
- Card details validation
- Payment processing animation
- Transaction record creation
- Real-time status updates

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Authentication Middleware**: Protected routes
- **Input Validation**: Form validation and sanitization
- **Secure Sessions**: Supabase Auth session management

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Smooth Animations**: Framer Motion transitions
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Clear confirmation messages

## 📊 Database Schema

### Students Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `name`: Text
- `email`: Text
- `fees_paid`: Boolean
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Transactions Table
- `id`: UUID (Primary Key)
- `student_id`: UUID (Foreign Key to students)
- `amount`: Integer
- `payment_method`: Text
- `card_last_four`: Text
- `status`: Enum (pending, completed, failed)
- `transaction_id`: Text (Unique)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## 🔄 Real-time Features

- **Live Payment Updates**: Payment status changes reflect immediately
- **Student List Sync**: New registrations appear in real-time
- **Profile Updates**: Changes sync across browser tabs

## 🧪 Testing

The application includes comprehensive error handling and validation:

- Form validation for all input fields
- Network error handling
- Authentication state management
- Payment simulation with realistic delays

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔧 Troubleshooting

### Common Issues:

#### "Failed to load profile" or "JSON object requested, multiple (or no) rows returned"
**Cause**: Database tables don't exist or student record is missing
**Solution**:
1. Visit `/setup` page to check database status
2. Run the `database-schema.sql` in your Supabase SQL Editor
3. Ensure RLS policies are properly set up

#### "Failed to load resource: 406" errors
**Cause**: Database schema not properly set up
**Solution**:
1. Check your Supabase project is active
2. Verify environment variables are correct
3. Run the complete database schema

#### Real-time updates not working
**Cause**: Real-time not enabled for tables
**Solution**:
1. Go to Supabase Dashboard → Database → Replication
2. Enable real-time for `students` and `transactions` tables

#### Authentication issues
**Cause**: Supabase Auth not properly configured
**Solution**:
1. Check your Supabase project settings
2. Verify the anon key has proper permissions
3. Check RLS policies allow the required operations

### Quick Debug Steps:
1. Visit `/setup` to check database configuration
2. Check browser console for detailed error messages
3. Verify Supabase dashboard for any service issues
4. Ensure all environment variables are set correctly

## 🆘 Support

For support or questions:
1. Check the troubleshooting section above
2. Visit the `/setup` page for database verification
3. Review the database schema
4. Verify environment variables
5. Check Supabase dashboard for errors

## 🎯 Future Enhancements

- Email notifications for payments
- Payment receipts generation
- Admin dashboard
- Bulk payment processing
- Payment plans and installments
- Integration with real payment gateways
