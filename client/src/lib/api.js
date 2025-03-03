// JSON file storage simulation using localStorage
const STORAGE_KEY = 'employeeData';

const getStoredEmployees = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveEmployeeData = (employees) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
};

export const getAllEmployees = () => {
  return getStoredEmployees();
};

export const submitEmployeeData = async (data) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get existing employees and add the new one
    const employees = getStoredEmployees();
    const newEmployee = {
      ...data,
      id: employees.length + 1, // Simple ID generation
    };

    employees.push(newEmployee);
    saveEmployeeData(employees);

    return { success: true, message: 'Employee registered successfully' };
  } catch (error) {
    throw new Error(error.message || 'Failed to submit form');
  }
};