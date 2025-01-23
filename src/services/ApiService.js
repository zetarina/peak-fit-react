class ApiService {
  static baseURL = "http://localhost:5000";

  /**
   * Helper to handle fetch responses and errors
   */
  static async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Request failed");
    }
    return response.json();
  }

  /**
   * Standard GET request
   */
  static async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return this.handleResponse(response);
  }

  /**
   * Standard POST request
   */
  static async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  /**
   * Standard PUT request
   */
  static async put(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  /**
   * Standard DELETE request
   */
  static async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return this.handleResponse(response);
  }

  /**
   * Multipart POST request
   */
  static async postMultipart(endpoint, formData) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      body: formData,
    });
    return this.handleResponse(response);
  }

  /**
   * Helper to get authorization token from storage
   */
  static getAuthToken() {
    return (
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
  }

  /**
   * Authenticated GET request
   */
  static async safeGet(endpoint) {
    const token = this.getAuthToken();

    if (!token) throw new Error("Unauthorized: No token found.");

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return this.handleResponse(response);
  }

  /**
   * Authenticated POST request
   */
  static async safePost(endpoint, data) {
    const token = this.getAuthToken();
    if (!token) throw new Error("Unauthorized: No token found.");

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  /**
   * Authenticated PUT request
   */
  static async safePut(endpoint, data) {
    const token = this.getAuthToken();
    if (!token) throw new Error("Unauthorized: No token found.");

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  /**
   * Authenticated DELETE request
   */
  static async safeDelete(endpoint) {
    const token = this.getAuthToken();
    if (!token) throw new Error("Unauthorized: No token found.");

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return this.handleResponse(response);
  }

  /**
   * Authenticated multipart POST request
   */
  static async safePostMultipart(endpoint, formData) {
    const token = this.getAuthToken();
    if (!token) throw new Error("Unauthorized: No token found.");

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  /**
   * Authenticated multipart PUT request
   */
  static async safePutMultipart(endpoint, formData) {
    const token = this.getAuthToken();
    if (!token) throw new Error("Unauthorized: No token found.");

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return this.handleResponse(response);
  }
}

export default ApiService;
