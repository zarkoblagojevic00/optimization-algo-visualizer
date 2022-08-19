const deepCopy = (obj) =>
    typeof obj !== "object"
        ? obj
        : Object.entries(obj).reduce((copy, [key, value]) => {
              copy[key] =
                  typeof value === "object" && value !== null
                      ? Array.isArray(value)
                          ? value.map(deepCopy)
                          : deepCopy(value)
                      : value;
              return copy;
          }, {});

export { deepCopy };
