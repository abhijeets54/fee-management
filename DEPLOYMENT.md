# Deployment Guide

## Quick Start Checklist

### 1. Supabase Setup
- [ ] Create a new Supabase project
- [ ] Copy the project URL and anon key
- [ ] Run the SQL schema from `database-schema.sql`
- [ ] Enable real-time for the `students` and `transactions` tables

### 2. Environment Variables
Create `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema Setup
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire `database-schema.sql` file
3. Click "Run" to execute the schema

### 4. Enable Real-time (Important!)
1. Go to Supabase Dashboard → Database → Replication
2. Enable real-time for:
   - `students` table
   - `transactions` table

### 5. Test Locally
```bash
npm install
npm run dev
```

### 6. Deploy to Vercel
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Testing the Application

### Test Flow:
1. **Home Page** → Should load with navigation
2. **All Students** → Should show empty list initially
3. **Sign Up** → Create a test account
4. **Profile** → Should redirect after signup
5. **Payment** → Test payment simulation
6. **All Students** → Should now show your student record with "Paid" status

### Test Data:
- Use any email format for testing
- Use any card number (e.g., 4111 1111 1111 1111)
- Use any future expiry date (e.g., 12/25)
- Use any 3-digit CVV (e.g., 123)

## Common Issues & Solutions

### Issue: "Failed to load profile"
**Solution**: Check if the database schema was properly created and RLS policies are enabled.

### Issue: Real-time updates not working
**Solution**: Ensure real-time is enabled for both tables in Supabase Dashboard.

### Issue: Authentication redirects not working
**Solution**: Check that the middleware is properly configured and environment variables are set.

### Issue: Payment simulation fails
**Solution**: Verify that the transactions table exists and has proper RLS policies.

## Production Considerations

### Security:
- [ ] Review RLS policies
- [ ] Enable email confirmation in Supabase Auth settings
- [ ] Set up proper CORS policies
- [ ] Configure rate limiting

### Performance:
- [ ] Enable database indexes (included in schema)
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and logging

### Features to Add:
- [ ] Email notifications
- [ ] Payment receipts
- [ ] Admin dashboard
- [ ] Bulk operations
- [ ] Data export functionality

## Environment-Specific Settings

### Development:
- Use Supabase local development (optional)
- Enable detailed error logging
- Use test payment data

### Production:
- Enable email confirmation
- Set up proper error monitoring
- Configure backup strategies
- Set up SSL certificates (handled by Vercel)

## Monitoring & Maintenance

### Key Metrics to Monitor:
- User registration rate
- Payment success rate
- Page load times
- Error rates
- Database performance

### Regular Maintenance:
- Monitor database storage usage
- Review and optimize queries
- Update dependencies
- Backup database regularly
- Review security logs

## Support & Troubleshooting

### Logs to Check:
1. **Browser Console**: For frontend errors
2. **Supabase Logs**: For database and auth issues
3. **Vercel Logs**: For deployment and runtime issues

### Debug Mode:
Add to `.env.local` for detailed logging:
```env
NEXT_PUBLIC_DEBUG=true
```

### Contact Points:
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support

## Success Criteria

Your deployment is successful when:
- [ ] Users can register and login
- [ ] All Students page shows real-time data
- [ ] Profile page loads user data correctly
- [ ] Payment simulation works end-to-end
- [ ] Real-time updates work across tabs
- [ ] Mobile responsive design works
- [ ] No console errors in production
