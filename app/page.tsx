import Layout from './components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to Social Savvy API Integration
        </h1>
        <p className="text-gray-300 mb-8">
          Here you will be able to interact with all the API calls for the Social Savvy toolkit. 
          Use the sidebar navigation to explore different API integration options.
        </p>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">API Integration Options</h2>
          <p className="text-gray-400 mb-4">Explore the various API endpoints available</p>
          
          <ul className="space-y-2">
            <li>• Tenant Management</li>
            <li>• Brand Management</li>
            <li>• Brand Compass</li>
            <li>• Source Management</li>
            <li>• Prompt Management</li>
            <li>• Worker Management</li>
            <li>• Generation Management</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
