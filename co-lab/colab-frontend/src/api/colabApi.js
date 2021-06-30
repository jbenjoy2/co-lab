import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class ColabAPI {
  // store auth token here for use throughout app
  static token;

  // base request helper method
  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ColabAPI.token}` };
    const params = method === "get" ? data : {};

    try {
      const response = await axios({ url, headers, params, method, data });
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response);

      throw error.response;
    }
  }

  //   user API routes
  static async getAllUsers(username = "") {
    const data = { username };
    let response = await this.request("users", data);
    return response;
  }
  static async getAllSections() {
    let response = await this.request("sections");

    return response.sections;
  }
  static async getUser(username) {
    let response = await this.request(`users/${username}`);
    return response.user;
  }
  static async updateUser(username, data) {
    let response = await this.request(`users/${username}`, data, "patch");
    return response.user;
  }
  static async loginUser(data) {
    let response = await this.request(`users/login`, data, "POST");
    return response.token;
  }

  static async registerUser(data) {
    let response = await this.request(`users/register`, data, "post");
    return response.token;
  }

  static async getProject(id) {
    let response = await this.request(`projects/${id}`);
    return response.project;
  }

  static async getProjectDetails(id) {
    let response = await this.request(`projects/${id}/basic`);
    return response.project;
  }
  static async getQuote() {
    let response = await this.request(`quote`);
    return response.foundQuote;
  }

  static async getRhymes(word) {
    let response = await this.request(`rhymes/${word}`);
    return response.foundRhymes;
  }
  static async getSections() {
    let response = await this.request("sections");
    return response.sections;
  }
  static async getArrangement(projectId) {
    let response = await this.request(`arrangements/${projectId}`);
    return response.arrangement;
  }
  static async updatedProjectArrangement(projectId, data) {
    let response = await this.request(`arrangements/${projectId}`, data, "put");
    return response;
  }

  static async createNewProject(title, owner) {
    let response = await this.request("projects/new", { title, owner }, "post");
    return response.newProject;
  }
  static async updatedProject(projectId, data) {
    let response = await this.request(`projects/${projectId}`, data, "patch");
    return response;
  }

  static async deleteProject(projectId) {
    let response = await this.request(`projects/${projectId}`, {}, "delete");
    return response;
  }

  static async leaveProject(data) {
    let response = await this.request(`cowrites`, data, "delete");
    return response;
  }

  static async getUserRequests(username) {
    let response = await this.request(`requests/${username}`);
    return response;
  }
  static async getProjectRequests(projectId) {
    let response = await this.request(`requests/projects/${projectId}`);
    return response;
  }
  static async makeRequest(sender, data) {
    let response = await this.request(`requests/${sender}/new`, data, "post");
    return response;
  }
  static async acceptRequest(requestId) {
    const data = { response: "accept" };
    let response = await this.request(`requests/${requestId}`, data, "put");
    return response;
  }
  static async rejectRequest(requestId) {
    const data = { response: "reject" };
    let response = await this.request(`requests/${requestId}`, data, "put");
    return response;
  }
}

export default ColabAPI;
