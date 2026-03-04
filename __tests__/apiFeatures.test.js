const APIFeatures = require("../utils/apiFeatures");

// Mock query object that mimics Mongoose query chainability
const createMockQuery = () => {
  const query = {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };
  return query;
};

describe("APIFeatures", () => {
  describe("constructor", () => {
    test("sets query and queryString", () => {
      const mockQuery = createMockQuery();
      const queryString = { page: "1" };
      const features = new APIFeatures(mockQuery, queryString);
      expect(features.query).toBe(mockQuery);
      expect(features.queryString).toBe(queryString);
    });
  });

  describe("filter", () => {
    test("excludes page, sort, limit, fields from filter", () => {
      const mockQuery = createMockQuery();
      const queryString = { page: "1", sort: "name", limit: "10", fields: "name", status: "active" };
      const features = new APIFeatures(mockQuery, queryString);
      features.filter();
      expect(mockQuery.find).toHaveBeenCalledWith({ status: "active" });
    });

    test("replaces gte, gt, lte, lt with MongoDB operators", () => {
      const mockQuery = createMockQuery();
      const queryString = { price: { gte: "10", lte: "100" } };
      const features = new APIFeatures(mockQuery, queryString);
      features.filter();
      expect(mockQuery.find).toHaveBeenCalledWith({ price: { $gte: "10", $lte: "100" } });
    });

    test("handles empty query string", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, {});
      features.filter();
      expect(mockQuery.find).toHaveBeenCalledWith({});
    });

    test("returns this for chaining", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, {});
      const result = features.filter();
      expect(result).toBe(features);
    });
  });

  describe("sort", () => {
    test("sorts by provided field", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, { sort: "price,-name" });
      features.sort();
      expect(mockQuery.sort).toHaveBeenCalledWith("price -name");
    });

    test("defaults to -createdAt when no sort specified", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, {});
      features.sort();
      expect(mockQuery.sort).toHaveBeenCalledWith("-createdAt");
    });

    test("returns this for chaining", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, {});
      const result = features.sort();
      expect(result).toBe(features);
    });
  });

  describe("limitFields", () => {
    test("selects specified fields", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, { fields: "name,price,status" });
      features.limitFields();
      expect(mockQuery.select).toHaveBeenCalledWith("name price status");
    });

    test("does nothing when no fields specified", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, {});
      features.limitFields();
      expect(mockQuery.select).not.toHaveBeenCalled();
    });

    test("returns this for chaining", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, {});
      const result = features.limitFields();
      expect(result).toBe(features);
    });
  });

  describe("paginate", () => {
    test("defaults to page 1, limit 20", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, {});
      features.paginate();
      expect(features.page).toBe(1);
      expect(features.limit).toBe(20);
      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(20);
    });

    test("calculates skip correctly", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, { page: "3", limit: "10" });
      features.paginate();
      expect(features.page).toBe(3);
      expect(features.limit).toBe(10);
      expect(mockQuery.skip).toHaveBeenCalledWith(20); // (3-1) * 10
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
    });

    test("clamps limit to max 100", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, { limit: "500" });
      features.paginate();
      expect(features.limit).toBe(100);
    });

    test("clamps limit to min 1", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, { limit: "-5" });
      features.paginate();
      expect(features.limit).toBe(1);
    });

    test("clamps page to min 1", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, { page: "-1" });
      features.paginate();
      expect(features.page).toBe(1);
    });

    test("handles non-numeric page/limit", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, { page: "abc", limit: "xyz" });
      features.paginate();
      expect(features.page).toBe(1);
      expect(features.limit).toBe(20);
    });

    test("returns this for chaining", () => {
      const mockQuery = createMockQuery();
      const features = new APIFeatures(mockQuery, {});
      const result = features.paginate();
      expect(result).toBe(features);
    });
  });

  describe("chaining", () => {
    test("all methods can be chained together", () => {
      const mockQuery = createMockQuery();
      const queryString = {
        status: "active",
        sort: "price",
        fields: "name,price",
        page: "2",
        limit: "25",
      };
      const features = new APIFeatures(mockQuery, queryString);
      const result = features.filter().sort().limitFields().paginate();
      expect(result).toBe(features);
      expect(mockQuery.find).toHaveBeenCalled();
      expect(mockQuery.sort).toHaveBeenCalledWith("price");
      expect(mockQuery.select).toHaveBeenCalledWith("name price");
      expect(features.page).toBe(2);
      expect(features.limit).toBe(25);
    });
  });
});
