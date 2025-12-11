export default function LoadingVerification() {
    return (
        <div className="bg-white shadow-lg border-l-4 border-gray-300 animate-pulse">
            {/* Header Skeleton */}
            <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="space-y-2">
                        <div className="bg-gray-300 h-6 w-64 rounded"></div>
                        <div className="bg-gray-200 h-4 w-40 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Status Bar Skeleton */}
            <div className="px-8 py-4 bg-gray-50 border-b border-gray-100">
                <div className="bg-gray-200 h-4 w-48 rounded"></div>
            </div>

            {/* Document Type Skeleton */}
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
                <div className="bg-gray-200 h-3 w-32 rounded mb-2"></div>
                <div className="bg-gray-300 h-5 w-56 rounded"></div>
            </div>

            {/* Content Skeleton */}
            <div className="px-8 py-6 space-y-8">
                {/* Section 1 */}
                <div>
                    <div className="bg-gray-300 h-4 w-40 rounded mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="border-b border-gray-200 py-3">
                                <div className="bg-gray-200 h-3 w-24 rounded mb-2"></div>
                                <div className="bg-gray-300 h-4 w-full rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2 */}
                <div>
                    <div className="bg-gray-300 h-4 w-32 rounded mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="border-b border-gray-200 py-3">
                                <div className="bg-gray-200 h-3 w-24 rounded mb-2"></div>
                                <div className="bg-gray-300 h-4 w-full rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3 */}
                <div>
                    <div className="bg-gray-300 h-4 w-48 rounded mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border-b border-gray-200 py-3">
                                <div className="bg-gray-200 h-3 w-24 rounded mb-2"></div>
                                <div className="bg-gray-300 h-4 w-full rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hash Skeleton */}
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <div className="bg-gray-200 h-3 w-40 rounded mb-2"></div>
                    <div className="bg-gray-300 h-3 w-full rounded"></div>
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
                <div className="bg-gray-200 h-3 w-full rounded mx-auto"></div>
            </div>
        </div>
    );
}
