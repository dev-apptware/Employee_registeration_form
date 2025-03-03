// Mock API endpoint for development
const mockSubmitEmployee = async (data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Log the submitted data
  console.log('Submitted employee data:', data);
  
  // Simulate successful response
  return { success: true, message: 'Employee registered successfully' };
};

export const submitEmployeeData = async (data) => {
  try {
    // In a real app, this would be an API call
    const response = await mockSubmitEmployee(data);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to submit form');
  }
};
