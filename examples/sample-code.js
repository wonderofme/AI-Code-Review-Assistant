// Sample code for testing the AI Code Review Assistant

// Example 1: Function with potential issues
function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

// Example 2: Async function with error handling issues
async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  return data;
}

// Example 3: React component with potential issues
function UserProfile({ user }) {
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user.id) {
      setLoading(true);
      fetchUserData(user.id).then(data => {
        setUserData(data);
        setLoading(false);
      });
    }
  }, [user.id]);
  
  return (
    <div>
      {loading ? <div>Loading...</div> : <div>{user.name}</div>}
    </div>
  );
}

// Example 4: Security vulnerability example
function login(username, password) {
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  return database.query(query);
}

// Example 5: Performance issue example
function processLargeArray(items) {
  let result = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (items[i].id === items[j].id) {
        result.push(items[i]);
      }
    }
  }
  return result;
}

