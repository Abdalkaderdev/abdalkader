export interface CodeTemplate {
  name: string;
  description: string;
  category: 'form' | 'layout' | 'interactive' | 'data' | 'navigation';
  code: string;
}

export const codeTemplates: CodeTemplate[] = [
  {
    name: 'Login Form',
    description: 'Simple login form with email and password',
    category: 'form',
    code: `import React, { useState } from 'react';
import { Button, Input, Card } from '@abdalkader/ui';

function PreviewComponent() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Card className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Sign In
        </h2>
        
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange('email')}
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange('password')}
          />
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full"
        >
          Sign In
        </Button>
        
        <p className="text-center text-sm text-gray-600">
          Don't have an account? 
          <button className="text-blue-500 hover:underline ml-1">
            Sign up
          </button>
        </p>
      </form>
    </Card>
  );
}`
  },
  {
    name: 'Product Card',
    description: 'Product showcase card with image, details, and actions',
    category: 'layout',
    code: `import React, { useState } from 'react';
import { Button, Card } from '@abdalkader/ui';

function PreviewComponent() {
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = {
    name: 'Premium Headphones',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    rating: 4.5,
    reviews: 128
  };

  return (
    <Card className="max-w-sm mx-auto overflow-hidden">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <span className={\`text-xl \${isLiked ? 'text-red-500' : 'text-gray-400'}\`}>
            ♥
          </span>
        </button>
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
          25% OFF
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-400">★★★★★</span>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">
            \${product.price}
          </span>
          <span className="text-lg text-gray-500 line-through">
            \${product.originalPrice}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-3 py-1 border-x border-gray-300">
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 hover:bg-gray-100"
            >
              +
            </button>
          </div>
          <Button variant="primary" className="flex-1">
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}`
  },
  {
    name: 'Todo List',
    description: 'Interactive todo list with add, toggle, and delete functionality',
    category: 'interactive',
    code: `import React, { useState } from 'react';
import { Button, Input, Card } from '@abdalkader/ui';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function PreviewComponent() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Build awesome apps', completed: false },
    { id: 3, text: 'Share with the world', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <Card className="max-w-md mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Todo List</h2>
          <p className="text-sm text-gray-600">
            {completedCount} of {todos.length} completed
          </p>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add a new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="flex-1"
          />
          <Button onClick={addTodo} variant="primary">
            Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {todos.map(todo => (
            <div
              key={todo.id}
              className={\`flex items-center gap-3 p-3 border rounded-lg \${
                todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
              }\`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <span
                className={\`flex-1 \${
                  todo.completed 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900'
                }\`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        
        {todos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No todos yet. Add one above!
          </div>
        )}
      </div>
    </Card>
  );
}`
  },
  {
    name: 'User Profile Card',
    description: 'User profile display with avatar, info, and social links',
    category: 'layout',
    code: `import React, { useState } from 'react';
import { Button, Card } from '@abdalkader/ui';

function PreviewComponent() {
  const [isFollowing, setIsFollowing] = useState(false);

  const user = {
    name: 'Alex Johnson',
    username: '@alexj',
    bio: 'Full-stack developer passionate about creating amazing user experiences. Love React, TypeScript, and good coffee.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    followers: 1234,
    following: 567,
    posts: 89,
    location: 'San Francisco, CA',
    website: 'alexjohnson.dev'
  };

  return (
    <Card className="max-w-sm mx-auto">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-600">{user.username}</p>
        </div>
        
        <p className="text-sm text-gray-700 px-2">
          {user.bio}
        </p>
        
        <div className="flex justify-center gap-6 py-2">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{user.posts}</div>
            <div className="text-xs text-gray-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{user.followers}</div>
            <div className="text-xs text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{user.following}</div>
            <div className="text-xs text-gray-600">Following</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={isFollowing ? "outline" : "primary"}
            onClick={() => setIsFollowing(!isFollowing)}
            className="flex-1"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
          <Button variant="outline" className="flex-1">
            Message
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div>📍 {user.location}</div>
          <div>🌐 {user.website}</div>
        </div>
      </div>
    </Card>
  );
}`
  },
  {
    name: 'Dashboard Widget',
    description: 'Statistics dashboard widget with charts and metrics',
    category: 'data',
    code: `import React, { useState, useEffect } from 'react';
import { Card } from '@abdalkader/ui';

function PreviewComponent() {
  const [stats, setStats] = useState({
    users: 0,
    revenue: 0,
    orders: 0,
    growth: 0
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        users: 12543,
        revenue: 45678,
        orders: 1234,
        growth: 12.5
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    {
      label: 'Total Users',
      value: stats.users.toLocaleString(),
      change: '+12%',
      positive: true,
      icon: '👥'
    },
    {
      label: 'Revenue',
      value: \`$\${stats.revenue.toLocaleString()}\`,
      change: '+8%',
      positive: true,
      icon: '💰'
    },
    {
      label: 'Orders',
      value: stats.orders.toLocaleString(),
      change: '-3%',
      positive: false,
      icon: '📦'
    },
    {
      label: 'Growth Rate',
      value: \`\${stats.growth}%\`,
      change: '+2%',
      positive: true,
      icon: '📈'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Real-time business metrics</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="text-center">
            <div className="space-y-2">
              <div className="text-2xl">{metric.icon}</div>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">{metric.label}</div>
              <div className={\`text-xs font-medium \${
                metric.positive ? 'text-green-600' : 'text-red-600'
              }\`}>
                {metric.change}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: 'New user registered', time: '2 minutes ago', type: 'user' },
              { action: 'Order #1234 completed', time: '5 minutes ago', type: 'order' },
              { action: 'Payment received', time: '10 minutes ago', type: 'payment' },
              { action: 'New review posted', time: '15 minutes ago', type: 'review' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <div className={\`w-2 h-2 rounded-full \${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'order' ? 'bg-green-500' :
                  activity.type === 'payment' ? 'bg-yellow-500' : 'bg-purple-500'
                }\`}></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}`
  }
];

export function getTemplatesByCategory(category: CodeTemplate['category']): CodeTemplate[] {
  return codeTemplates.filter(template => template.category === category);
}

export function getTemplateByName(name: string): CodeTemplate | undefined {
  return codeTemplates.find(template => template.name === name);
}

export function getAllCategories(): CodeTemplate['category'][] {
  return ['form', 'layout', 'interactive', 'data', 'navigation'];
}