echo "--- Academics ---"
curl -s http://localhost:5173/academics | tr -d '\000' | grep -a -o "TEST College of Technology UPDATED" | head -n 1 || echo "Not found"

echo "--- College ---"
curl -s http://localhost:5173/academics/test-college-of-technology | tr -d '\000' | grep -a -o "TEST Department of Computer Science" | head -n 1 || echo "Not found"

echo "--- Department ---"
curl -s http://localhost:5173/academics/departments/test-department-of-computer-science | tr -d '\000' | grep -a -o "TEST Bachelor of Computer Science" | head -n 1 || echo "Not found"

echo "--- Program ---"
curl -s http://localhost:5173/academics/programs/test-bachelor-of-computer-science | tr -d '\000' | grep -a -o "TEST Department of Computer Science" | head -n 1 || echo "Not found"

echo "--- Program College ---"
curl -s http://localhost:5173/academics/programs/test-bachelor-of-computer-science | tr -d '\000' | grep -a -o "TEST College of Technology" | head -n 1 || echo "Not found"

