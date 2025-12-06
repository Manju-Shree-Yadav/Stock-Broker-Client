import React from 'react'

const Loader = () => {
    return (
        <div>
            <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
                    </div>
                    <p className="text-lg text-gray-700">Loading dashboard...</p>
                </div>
            </div>
        </div>
    )
}

export default Loader