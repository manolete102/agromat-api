export function paginateArray<T>(items: T[], page = 1, limit = 10) {
    const total = items.length;
    const start = (page - 1) * limit;
    const data = items.slice(start, start + limit);
    const pageCount = Math.max(1, Math.ceil(total / limit));
    return {
      data,
      meta: { page, limit, total, pageCount },
    };
  }
  