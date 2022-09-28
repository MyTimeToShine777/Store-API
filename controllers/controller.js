import Product from "../models/product.js";

const getAllProductsStatic = async(req, res) => {
    const search = "desk";
    const products = await Product.find({}).sort("name").select("name price");

    res.status(200).json({ nbHits: products.length, products });
};

const getAllProducts = async(req, res) => {
    const { featured, company, name, sort, select, numericFilters } = req.query;
    const queryObject = {};

    if (featured) {
        queryObject.featured = featured === "true" ? true : false;
    }

    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }
    //numericFilters
    if (numericFilters) {
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte",
        };
        const regEx = /\b(<|>|>=|<=|=)\b/g;
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        const options = ["price", "rating"];
        filters = filters.split(",").forEach((item) => {
            const [select, operator, value] = item.split("-");
            if (options.includes(select)) {
                queryObject[select] = {
                    [operator]: Number(value),
                };
            }
        });
    }

    let result = Product.find(queryObject);
    //sort
    if (sort) {
        const sortList = sort.split(",").join(" ");
        result = result.sort(sortList);
    } else {
        result = result.sort("createdAt");
    }
    //select
    if (select) {
        const selectList = select.split(",").join(" ");
        result = result.select(selectList);
    }
    //page
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ nbHits: products.length, products });
};

export { getAllProducts, getAllProductsStatic };