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

  //   get all users from database filtered on given username
  static async getAllUsers(username = "") {
    const data = { username };
    let response = await this.request("users", data);
    return response;
  }

  // get single user details from database with given username
  static async getUser(username) {
    let response = await this.request(`users/${username}`);
    return response.user;
  }

  // update a user in the database with passed data
  static async updateUser(username, data) {
    let response = await this.request(`users/${username}`, data, "patch");
    return response.user;
  }

  // login a user with valid username/password combo to return a JWT
  static async loginUser(data) {
    let response = await this.request(`users/login`, data, "POST");
    return response.token;
  }

  // add new user to database with valid data and return JWT
  static async registerUser(data) {
    let response = await this.request(`users/register`, data, "post");
    return response.token;
  }

  // retrieve single project from database
  static async getProject(id) {
    let response = await this.request(`projects/${id}`);
    return response.project;
  }

  // retrieve basic details of single project from database
  static async getProjectDetails(id) {
    let response = await this.request(`projects/${id}/basic`);
    return response.project;
  }

  // get random quote
  static async getQuote() {
    let response = await this.request(`quote`);
    return response.foundQuote;
  }

  // find rhymes for passed word
  static async getRhymes(word) {
    let response = await this.request(`rhymes/${word}`);
    return response.foundRhymes;
  }

  // retrieve all sections from database
  static async getSections() {
    let response = await this.request("sections");
    return response.sections;
  }

  // retrieve project arrangement in its current state from database
  static async getArrangement(projectId) {
    let response = await this.request(`arrangements/${projectId}`);
    return response.arrangement;
  }

  // update project arrangement in database with new state
  static async updatedProjectArrangement(projectId, data) {
    let response = await this.request(`arrangements/${projectId}`, data, "put");
    return response;
  }

  // create a new project in the database with the given title and owner
  static async createNewProject(title, owner) {
    let response = await this.request("projects/new", { title, owner }, "post");
    return response.newProject;
  }

  // update project in database with provided data
  static async updatedProject(projectId, data) {
    let response = await this.request(`projects/${projectId}`, data, "patch");
    return response;
  }

  // delete project from database
  static async deleteProject(projectId) {
    let response = await this.request(`projects/${projectId}`, {}, "delete");
    return response;
  }

  // leave from a cowrite
  static async leaveProject(data) {
    let response = await this.request(`cowrites`, data, "delete");
    return response;
  }

  // get all requests for a given user
  static async getUserRequests(username) {
    let response = await this.request(`requests/${username}`);
    return response;
  }

  // get all requests associated with a given project
  static async getProjectRequests(projectId) {
    let response = await this.request(`requests/projects/${projectId}`);
    return response;
  }

  // make a new request between two users for a given project
  static async makeRequest(sender, data) {
    let response = await this.request(`requests/${sender}/new`, data, "post");
    return response;
  }

  // accept a request to collaborate
  static async acceptRequest(requestId) {
    const data = { response: "accept" };
    let response = await this.request(`requests/${requestId}`, data, "put");
    return response;
  }
  // reject request to collaborate
  static async rejectRequest(requestId) {
    const data = { response: "reject" };
    let response = await this.request(`requests/${requestId}`, data, "put");
    return response;
  }
}

export default ColabAPI;
