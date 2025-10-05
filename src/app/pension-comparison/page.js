import PensionComparisonForm from '@/components/PensionComparisonForm';
import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PensionComparisonPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-800">
        {/* Header */}
        <AuthenticatedNavbar />

        {/* Page Header */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-black mb-4 drop-shadow-lg">
                Pension Scheme Comparison
              </h1>
              <p className="text-xl text-black max-w-3xl mx-auto drop-shadow-md">
                Compare your current pension plan with available schemes and get personalized recommendations for better retirement planning.
              </p>
            </div>
          </div>
        </div>

        {/* Form Component */}
        <PensionComparisonForm />
      </div>
    </ProtectedRoute>
  );
}
