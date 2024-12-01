export const errorHandler = (resolver: any) => async (parent: any, args: any, context: any, info: any) => {
    try {
      return await resolver(parent, args, context, info);
    } catch (err: any) {
      console.error("Error:", err.message);
      throw new Error(err.message || "An unexpected error occurred.");
    }
  };
  