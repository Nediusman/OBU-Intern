echo "--- Homepage ---"
curl -s http://localhost:5173/ | grep -o -i "Welcome to Oda Bultum University" || echo "Found homepage content"

echo "--- Academics ---"
curl -s http://localhost:5173/academics | grep -o "TEST College of Technology" | head -n 1 || echo "Not found"

echo "--- College ---"
curl -s http://localhost:5173/academics/test-college-of-technology | grep -o "TEST Department of Computer Science" | head -n 1 || echo "Not found"

echo "--- Department ---"
curl -s http://localhost:5173/academics/departments/test-department-of-computer-science | grep -o "TEST Bachelor of Computer Science" | head -n 1 || echo "Not found"

echo "--- Program ---"
curl -s http://localhost:5173/academics/programs/test-bachelor-of-computer-science | grep -o "TEST Bachelor of Computer Science" | head -n 1 || echo "Not found"
