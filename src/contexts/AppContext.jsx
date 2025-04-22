import React, { createContext, useState, useContext, useEffect } from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { formatCurrency } from '../utils/formatters';

// Sample categories with icons
const categories = [
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#e57373', budget: 500 },
  { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: '#64b5f6', budget: 300 },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: '#81c784', budget: 200 },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ba68c8', budget: 400 },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#ffb74d', budget: 200 },
  { id: 'housing', name: 'Housing', icon: '🏠', color: '#4fc3f7', budget: 1000 },
  { id: 'health', name: 'Health & Medical', icon: '⚕️', color: '#ff8a65', budget: 150 },
  { id: 'personal', name: 'Personal', icon: '👤', color: '#a1887f', budget: 200 },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#9575cd', budget: 500 },
  { id: 'education', name: 'Education', icon: '📚', color: '#7986cb', budget: 250 },
  { id: 'income', name: 'Income', icon: '💰', color: '#66bb6a', budget: 0 },
  { id: 'other', name: 'Other', icon: '📌', color: '#bdbdbd', budget: 100 },
];

// Task priority levels with colors
const taskPriorities = [
  { id: 'high', name: 'High', color: '#f44336' },
  { id: 'medium', name: 'Medium', color: '#ff9800' },
  { id: 'low', name: 'Low', color: '#4caf50' },
];

// Get month name
const getMonthName = (date) => {
  return new Date(date).toLocaleString('default', { month: 'long' });
};

// Get current month and year
const getCurrentMonthYear = () => {
  const date = new Date();
  return {
    month: date.getMonth(),
    year: date.getFullYear()
  };
};

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      fullName: 'Demo User',
      email: 'demo@example.com',
      avatar: '',
      accountType: 'Standard',
      joinDate: new Date().toISOString(),
      phone: ''
    };
  });

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Currency state - USD by default, can be toggled to INR
  const [useINR, setUseINR] = useState(() => {
    const savedCurrency = localStorage.getItem('useINR');
    return savedCurrency === 'true';
  });

  // UI States
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthYear());

  // Data States
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [isIncome, setIsIncome] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [recurring, setRecurring] = useState(false);
  const [budgets, setBudgets] = useState(() => {
    // Initialize with default budgets from categories
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : categories.reduce((acc, cat) => {
      acc[cat.id] = cat.budget;
      return acc;
    }, {});
  });
  
  // Task States
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [taskRelatedCategory, setTaskRelatedCategory] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [openBudgetDialog, setOpenBudgetDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  
  // Save data to localStorage when they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('useINR', useINR.toString());
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [expenses, darkMode, useINR, budgets, tasks, isAuthenticated, userProfile]);

  // Simulation of loading data to make UI more realistic
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [selectedMonth]);

  // Calculate filtered expenses for selected month/year
  const filteredExpenses = expenses.filter(expense => {
    if (!searchTerm) return true;
    
    const expenseDate = new Date(expense.date);
    const expenseMonth = expenseDate.getMonth();
    const expenseYear = expenseDate.getFullYear();
    
    return expenseMonth === selectedMonth.month && expenseYear === selectedMonth.year &&
      (searchTerm === '' || 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.tags && expense.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
  });

  // Calculate expenses for current month
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === selectedMonth.month && 
      expenseDate.getFullYear() === selectedMonth.year && 
      !expense.isIncome
    );
  });

  // Filter tasks by search term
  const filteredTasks = tasks.filter(task => 
    searchTerm === '' ||
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const incomeTotal = filteredExpenses
    .filter(expense => expense.isIncome)
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);
  
  const expenseTotal = filteredExpenses
    .filter(expense => !expense.isIncome)
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);
  
  const balance = incomeTotal - expenseTotal;

  // Calculate current month and last month totals
  const currentMonthIncome = filteredExpenses
    .filter(expense => expense.isIncome)
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const currentMonthTotal = filteredExpenses
    .filter(expense => !expense.isIncome)
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  // Get previous month data
  const getPreviousMonthData = () => {
    let prevMonth = selectedMonth.month - 1;
    let prevYear = selectedMonth.year;
    
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear -= 1;
    }
    
    const prevMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === prevMonth && 
             expenseDate.getFullYear() === prevYear;
    });
    
    const prevMonthIncome = prevMonthExpenses
      .filter(expense => expense.isIncome)
      .reduce((total, expense) => total + parseFloat(expense.amount), 0);
    
    const prevMonthExpenseTotal = prevMonthExpenses
      .filter(expense => !expense.isIncome)
      .reduce((total, expense) => total + parseFloat(expense.amount), 0);
    
    return { income: prevMonthIncome, expense: prevMonthExpenseTotal };
  };
  
  const { income: lastMonthIncome, expense: lastMonthTotal } = getPreviousMonthData();

  // Calculate average monthly expenses over all time
  const getAverageMonthlyData = () => {
    // Group expenses by month/year
    const monthlyTotals = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] = { income: 0, expense: 0 };
      }
      
      if (expense.isIncome) {
        monthlyTotals[monthYear].income += parseFloat(expense.amount);
      } else {
        monthlyTotals[monthYear].expense += parseFloat(expense.amount);
      }
    });
    
    const months = Object.values(monthlyTotals);
    const totalMonths = months.length || 1; // Avoid division by zero
    
    const totalIncome = months.reduce((sum, month) => sum + month.income, 0);
    const totalExpense = months.reduce((sum, month) => sum + month.expense, 0);
    
    return { 
      avgIncome: totalIncome / totalMonths,
      avgExpense: totalExpense / totalMonths
    };
  };
  
  const { avgIncome: avgMonthlyIncome, avgExpense: avgMonthlyExpense } = getAverageMonthlyData();

  // Calculate lifetime totals
  const totalIncome = expenses
    .filter(expense => expense.isIncome)
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);
  
  const totalExpenses = expenses
    .filter(expense => !expense.isIncome)
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  // Group expenses by category
  const expensesByCategory = filteredExpenses
    .filter(expense => !expense.isIncome)
    .reduce((acc, expense) => {
      const { category, amount } = expense;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(amount);
      return acc;
    }, {});

  // Calculate weekly spending
  const getWeeklyData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Initialize weekly data
    let weekData = [];
    for (let i = 0; i < 5; i++) {
      weekData.push({
        week: `Week ${i + 1}`,
        expenses: 0,
        income: 0
      });
    }
    
    // Populate weekly data
    filteredExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      // Calculate which week of the month
      const dayOfMonth = expenseDate.getDate();
      const weekIndex = Math.min(Math.floor((dayOfMonth - 1) / 7), 4);
      
      if (expense.isIncome) {
        weekData[weekIndex].income += parseFloat(expense.amount);
      } else {
        weekData[weekIndex].expenses += parseFloat(expense.amount);
      }
    });
    
    return weekData;
  };

  // Get weekly data
  const weeklyData = getWeeklyData();

  // Spending trend
  const getTrend = () => {
    if (weeklyData.length < 2) return 0;
    
    const lastWeekIndex = weeklyData.length - 1;
    const currentWeek = weeklyData[lastWeekIndex].expenses;
    const previousWeek = weeklyData[lastWeekIndex - 1].expenses;
    
    if (previousWeek === 0) return 100;
    
    return ((currentWeek - previousWeek) / previousWeek) * 100;
  };

  // Calculate budget status
  const getBudgetStatus = () => {
    const totalBudget = Object.values(budgets).reduce((total, budget) => total + budget, 0);
    const percentage = (expenseTotal / totalBudget) * 100;
    
    return {
      percentage: Math.min(percentage, 100),
      remaining: totalBudget - expenseTotal,
      total: totalBudget
    };
  };

  const budgetStatus = getBudgetStatus();

  // Calculate category budget status
  const getCategoryBudgetStatus = (categoryId) => {
    const categoryTotal = expensesByCategory[categoryId] || 0;
    const categoryBudget = budgets[categoryId] || 0;
    
    if (categoryBudget === 0) return { percentage: 0, remaining: 0 };
    
    const percentage = (categoryTotal / categoryBudget) * 100;
    
    return {
      percentage: Math.min(percentage, 100),
      remaining: categoryBudget - categoryTotal,
      total: categoryBudget,
      isOverBudget: percentage > 100
    };
  };

  // Task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  };

  const taskStats = getTaskStats();

  // Calculate percentage change between two values
  const getPercentageChange = (oldValue, newValue) => {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return Math.round(((newValue - oldValue) / oldValue) * 100);
  };

  // Get trend icon based on percentage change
  const getTrendIcon = (percentChange) => {
    if (percentChange > 0) {
      return {
        icon: <TrendingUpIcon />,
        color: '#f44336' // Error color for increasing expenses
      };
    } else if (percentChange < 0) {
      return {
        icon: <TrendingDownIcon />,
        color: '#4caf50' // Success color for decreasing expenses
      };
    } else {
      return {
        icon: <TrendingUpIcon />,
        color: '#ff9800' // Warning color for no change
      };
    }
  };

  // Handle expense form submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (!description || !amount || !category || !date) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    // If we're editing an existing expense
    if (editingExpense) {
      const updatedExpenses = expenses.map(exp => 
        exp.id === editingExpense.id 
          ? {
              ...exp,
              description,
              amount: parseFloat(amount),
              category,
              date,
              isIncome,
              note,
              tags,
              recurring
            }
          : exp
      );
      
      setExpenses(updatedExpenses);
      setSnackbar({
        open: true,
        message: 'Expense updated successfully!',
        severity: 'success'
      });
      setEditingExpense(null);
    } else {
      // Adding a new expense
      const newExpense = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        category,
        date,
        isIncome,
        note,
        tags,
        recurring,
        createdAt: new Date().toISOString()
      };
      
      setExpenses([...expenses, newExpense]);
      setSnackbar({
        open: true,
        message: `${isIncome ? 'Income' : 'Expense'} added successfully!`,
        severity: 'success'
      });
    }
    
    // Reset form
    resetForm();
    setOpenDialog(false);
  };

  // Handle task form submission
  const handleTaskSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (!taskTitle || !taskPriority || !taskDueDate) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required task fields',
        severity: 'error'
      });
      return;
    }
    
    // If we're editing an existing task
    if (editingTask) {
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id 
          ? {
              ...task,
              title: taskTitle,
              description: taskDescription,
              priority: taskPriority,
              dueDate: taskDueDate,
              category: taskRelatedCategory,
              updatedAt: new Date().toISOString()
            }
          : task
      );
      
      setTasks(updatedTasks);
      setSnackbar({
        open: true,
        message: 'Task updated successfully!',
        severity: 'success'
      });
      setEditingTask(null);
    } else {
      // Adding a new task
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        dueDate: taskDueDate,
        category: taskRelatedCategory,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTasks([...tasks, newTask]);
      setSnackbar({
        open: true,
        message: 'Task added successfully!',
        severity: 'success'
      });
    }
    
    // Reset task form
    resetTaskForm();
    setOpenTaskDialog(false);
  };

  // Reset form fields
  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().slice(0, 10));
    setNote('');
    setIsIncome(false);
    setTags([]);
    setTagInput('');
    setRecurring(false);
  };

  // Reset task form fields
  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskDueDate(new Date().toISOString().slice(0, 10));
    setTaskRelatedCategory('');
  };

  // Delete an expense
  const handleDelete = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    setSnackbar({
      open: true,
      message: 'Entry deleted successfully!',
      severity: 'info'
    });
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    setSnackbar({
      open: true,
      message: 'Task deleted successfully!',
      severity: 'info'
    });
  };

  // Toggle task completion status
  const handleToggleTaskComplete = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    );
    
    setTasks(updatedTasks);
    
    const completedTask = updatedTasks.find(task => task.id === id);
    setSnackbar({
      open: true,
      message: `Task marked as ${completedTask.completed ? 'completed' : 'pending'}!`,
      severity: 'success'
    });
  };

  // Edit an expense
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setDescription(expense.description);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date);
    setNote(expense.note || '');
    setIsIncome(expense.isIncome || false);
    setTags(expense.tags || []);
    setRecurring(expense.recurring || false);
  };

  // Edit a task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setTaskPriority(task.priority);
    setTaskDueDate(task.dueDate);
    setTaskRelatedCategory(task.category || '');
    
    setOpenTaskDialog(true);
  };

  // Add a tag
  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Update budgets
  const handleUpdateBudgets = (categoryId, newAmount) => {
    setBudgets({
      ...budgets,
      [categoryId]: parseFloat(newAmount)
    });
  };

  // Export data as JSON
  const handleExportData = () => {
    const dataToExport = {
      expenses,
      tasks,
      budgets
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `finance_task_tracker_data_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setSnackbar({
      open: true,
      message: 'Data exported successfully!',
      severity: 'success'
    });
  };

  // Import data from JSON
  const handleImportData = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          if (importedData.expenses && Array.isArray(importedData.expenses)) {
            setExpenses(importedData.expenses);
          }
          
          if (importedData.tasks && Array.isArray(importedData.tasks)) {
            setTasks(importedData.tasks);
          }
          
          if (importedData.budgets && typeof importedData.budgets === 'object') {
            setBudgets(importedData.budgets);
          }
          
          setSnackbar({
            open: true,
            message: 'Data imported successfully!',
            severity: 'success'
          });
        } catch (error) {
          console.error('Import error:', error);
          setSnackbar({
            open: true,
            message: 'Failed to import data: Invalid format',
            severity: 'error'
          });
        }
      };
      
      reader.readAsText(file);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle dialogs
  const toggleDialog = () => setOpenDialog(!openDialog);
  const toggleFilterDialog = () => setOpenFilterDialog(!openFilterDialog);
  const toggleBudgetDialog = () => setOpenBudgetDialog(!openBudgetDialog);
  const toggleTaskDialog = () => {
    setOpenTaskDialog(!openTaskDialog);
    if (!openTaskDialog) {
      resetTaskForm();
      setEditingTask(null);
    }
  };
  
  // Toggle Expense Dialog - Enhanced to support income vs expense
  const toggleExpenseDialog = (options = {}) => {
    setOpenDialog(!openDialog);
    
    if (!openDialog) {
      // Opening the dialog
      if (options.expense) {
        // Edit mode - load the expense data
        handleEdit(options.expense);
      } else {
        // New entry mode - reset the form
        resetForm();
        // Pre-set isIncome if specified
        if (options.isIncome === true) {
          setIsIncome(true);
          setCategory('income'); // Default to income category
        }
      }
    }
  };

  // Print expense report
  const printExpenseReport = () => {
    const printContent = document.createElement('div');
    printContent.style.width = '100%';
    printContent.style.padding = '20px';
    
    // Create report title
    const title = document.createElement('h1');
    title.innerText = `Financial Report - ${currentMonthYearDisplay}`;
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    printContent.appendChild(title);
    
    // Create summary section
    const summary = document.createElement('div');
    summary.style.marginBottom = '30px';
    summary.innerHTML = `
      <h2>Summary</h2>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div style="width: 30%;">
          <p><strong>Income:</strong> ${formatCurrency(currentMonthIncome, useINR ? 'INR' : 'USD')}</p>
          <p><strong>Expenses:</strong> ${formatCurrency(currentMonthTotal, useINR ? 'INR' : 'USD')}</p>
          <p><strong>Balance:</strong> ${formatCurrency(currentMonthIncome - currentMonthTotal, useINR ? 'INR' : 'USD')}</p>
        </div>
        <div style="width: 30%;">
          <p><strong>Last Month Income:</strong> ${formatCurrency(lastMonthIncome, useINR ? 'INR' : 'USD')}</p>
          <p><strong>Last Month Expenses:</strong> ${formatCurrency(lastMonthTotal, useINR ? 'INR' : 'USD')}</p>
          <p><strong>Average Monthly Expenses:</strong> ${formatCurrency(avgMonthlyExpense, useINR ? 'INR' : 'USD')}</p>
        </div>
        <div style="width: 30%;">
          <p><strong>Total Income:</strong> ${formatCurrency(totalIncome, useINR ? 'INR' : 'USD')}</p>
          <p><strong>Total Expenses:</strong> ${formatCurrency(totalExpenses, useINR ? 'INR' : 'USD')}</p>
          <p><strong>Net Balance:</strong> ${formatCurrency(totalIncome - totalExpenses, useINR ? 'INR' : 'USD')}</p>
        </div>
      </div>
    `;
    printContent.appendChild(summary);
    
    // Create expense details table
    const expenseTable = document.createElement('div');
    expenseTable.innerHTML = `
      <h2>Expense Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Date</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Category</th>
            <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Amount</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Type</th>
          </tr>
        </thead>
        <tbody>
          ${filteredExpenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(expense => `
              <tr>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${formatDate(expense.date)}</td>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${expense.description}</td>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${getCategoryById(expense.category).name}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${formatCurrency(expense.amount, useINR ? 'INR' : 'USD')}</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd; color: ${expense.isIncome ? 'green' : 'red'}">
                  ${expense.isIncome ? 'Income' : 'Expense'}
                </td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    `;
    printContent.appendChild(expenseTable);
    
    // Add a footer with date
    const footer = document.createElement('div');
    footer.style.marginTop = '30px';
    footer.style.textAlign = 'right';
    footer.innerHTML = `<p>Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>`;
    printContent.appendChild(footer);
    
    // Create a temporary iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.left = '-9999px';
    document.body.appendChild(printFrame);
    
    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(`
      <html>
        <head>
          <title>Expense Report - ${currentMonthYearDisplay}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1, h2 { color: #333; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    frameDoc.close();
    
    // Print and remove the iframe
    setTimeout(() => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
      document.body.removeChild(printFrame);
      
      setSnackbar({
        open: true,
        message: 'Expense report printed successfully!',
        severity: 'success'
      });
    }, 500);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Get category details by id
  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || { 
      name: categoryId, 
      icon: '📌', 
      color: '#bdbdbd' 
    };
  };

  // Get task priority details
  const getTaskPriorityDetails = (priorityId) => {
    return taskPriorities.find(p => p.id === priorityId) || taskPriorities[1]; // Default to medium
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Check if task is overdue
  const isTaskOverdue = (task) => {
    if (task.completed) return false;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };

  // Handle month change
  const handleMonthChange = (increment) => {
    setSelectedMonth(prev => {
      let newMonth = prev.month + increment;
      let newYear = prev.year;
      
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      } else if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
      
      return { month: newMonth, year: newYear };
    });
  };

  // Get formatted current month and year
  const currentMonthYearDisplay = `${getMonthName(new Date(selectedMonth.year, selectedMonth.month, 1))} ${selectedMonth.year}`;

  // Auth functions
  const handleLogin = (email) => {
    setIsAuthenticated(true);
    
    // If user doesn't exist yet, create a new profile
    if (userProfile.email !== email) {
      const newProfile = {
        ...userProfile,
        email,
        joinDate: new Date().toISOString()
      };
      setUserProfile(newProfile);
    }
    
    setSnackbar({
      open: true,
      message: 'Successfully logged in!',
      severity: 'success'
    });
  };

  const handleRegister = (name, email) => {
    setIsAuthenticated(true);
    
    const newProfile = {
      fullName: name,
      email,
      avatar: '',
      accountType: 'Standard',
      joinDate: new Date().toISOString(),
      phone: ''
    };
    
    setUserProfile(newProfile);
    
    setSnackbar({
      open: true,
      message: 'Account created successfully!',
      severity: 'success'
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    
    // Force navigation to login page
    window.location.href = '/login';
    
    setSnackbar({
      open: true,
      message: 'Successfully logged out',
      severity: 'info'
    });
  };

  const updateUserProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    
    setSnackbar({
      open: true,
      message: 'Profile updated successfully!',
      severity: 'success'
    });
  };

  // Toggle currency between USD and INR
  const toggleCurrency = () => {
    setUseINR(!useINR);
    setSnackbar({
      open: true,
      message: !useINR ? 'Currency changed to Indian Rupees (₹)' : 'Currency changed to US Dollars ($)',
      severity: 'info'
    });
  };

  return (
    <AppContext.Provider value={{
      // Auth
      isAuthenticated, 
      userProfile,
      handleLogin,
      handleRegister,
      handleLogout,
      updateUserProfile,
      
      // Theme
      darkMode, toggleDarkMode,
      
      // Currency
      useINR, toggleCurrency,
      
      // Data
      expenses, filteredExpenses, setExpenses,
      tasks, filteredTasks, setTasks,
      budgets, setBudgets,
      
      // UI States
      selectedMonth, handleMonthChange, currentMonthYearDisplay,
      isLoading, searchTerm, setSearchTerm,
      snackbar, setSnackbar, handleCloseSnackbar,
      
      // Dialog States
      openDialog, toggleDialog, toggleExpenseDialog,
      openFilterDialog, toggleFilterDialog,
      openBudgetDialog, toggleBudgetDialog,
      openTaskDialog, toggleTaskDialog,
      
      // Form States
      description, setDescription,
      amount, setAmount,
      category, setCategory,
      date, setDate,
      note, setNote,
      isIncome, setIsIncome,
      tagInput, setTagInput,
      tags, setTags,
      recurring, setRecurring,
      editingExpense, setEditingExpense,
      
      // Task Form States
      taskTitle, setTaskTitle,
      taskDescription, setTaskDescription,
      taskPriority, setTaskPriority,
      taskDueDate, setTaskDueDate,
      taskRelatedCategory, setTaskRelatedCategory,
      editingTask, setEditingTask,
      
      // Calculated Values
      incomeTotal, expenseTotal, balance,
      currentMonthIncome, currentMonthTotal,
      lastMonthIncome, lastMonthTotal, 
      avgMonthlyIncome, avgMonthlyExpense,
      totalIncome, totalExpenses,
      budgetStatus, expensesByCategory,
      weeklyData, taskStats,
      
      // Helper Functions
      formatDate, getCategoryById, getTaskPriorityDetails,
      isTaskOverdue, getTrend, getCategoryBudgetStatus,
      getPercentageChange, getTrendIcon,
      
      // Form Handlers
      handleSubmit, resetForm,
      handleTaskSubmit, resetTaskForm,
      handleDelete, handleEdit,
      handleDeleteTask, handleEditTask, handleToggleTaskComplete,
      handleAddTag, handleRemoveTag,
      handleUpdateBudgets,
      handleExportData, handleImportData,
      printExpenseReport,
      
      // Constants
      categories, taskPriorities
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext; 