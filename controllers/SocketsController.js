import CategoryModel from "../models/CategoryModel.js";
import ProductModel from "../models/ProductModel.js";
import StoreOwner from "../models/StoreOwner.js";
import { v2 as cloudinary } from "cloudinary";

const HandleCreateProduct = async (req, res, io) => {
    try {
        const { storeID } = req.params;

        const {
            title,
            desc,
            slug,
            isVariable,
            price,
            discountPrice,
            stock,
            variations,
            netWeight,
            length,
            width,
            height,
            discountStartsDate,
            discountStartTime,
            discountEndDate,
            discountEndTime,
        } = req.body;

        let category = Array.isArray(req.body.category) ? req.body.category : [req.body.category];

        const findStore = await StoreOwner.findById(storeID);
        if (!findStore) {
            return res.status(404).json({ message: "Store Not Found" });
        }

        if (findStore.status.includes("Inactive")) {
            return res.status(403).json({ message: "Your Store Has Been Deactivated By Admin, Contact Admin To Enable Your Store" });
        }

        const productImage = req?.files?.productImage;
        const uploadResult = productImage ? await cloudinary.uploader.upload(productImage.tempFilePath, {
            resource_type: 'image',
            folder: `${findStore.storeName} products`,
        }) : '';

        const galleryImages = req?.files?.galleryImages;
        const imageUrls = [];
        if (Array.isArray(galleryImages)) {
            for (const image of galleryImages) {
                const uploadResult = await cloudinary.uploader.upload(image?.tempFilePath);
                imageUrls.push(uploadResult.secure_url);
            }
        } else if (galleryImages) {
            const uploadResult = await cloudinary.uploader.upload(galleryImages?.tempFilePath);
            imageUrls.push(uploadResult.secure_url);
        }

        const findProduct = await ProductModel.findOne({ $or: [{ title }, { slug }] });
        if (findProduct) {
            return res.status(400).json({ message: "Product Already Exists, Title And Slug Should Be Unique" });
        }

        if (isVariable === false || isVariable === 'false') {
            const createProduct = new ProductModel({
                storeID,
                title,
                desc,
                slug,
                isVariable,
                price,
                discountPrice,
                stock,
                category: Array.isArray(category) ? category : [category],
                productImage: uploadResult.secure_url,
                galleryImages: imageUrls,
                netWeight,
                length,
                width,
                height,
                discountStartsDate: discountStartsDate ? new Date(discountStartsDate) : null,
                discountStartTime: discountStartTime ? new Date(discountStartTime) : null,
                discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
                discountEndTime: discountEndTime ? new Date(discountEndTime) : null,
            });
            await createProduct.save();

            if (io) {
                io.emit('productCreated', { product: createProduct });
            }

            return res.status(201).json({ message: "Product Created Successfully", product: createProduct });
        } else if (isVariable === true || isVariable === 'true') {
            let variationsData = typeof variations === "string" ? JSON.parse(variations) : variations?.map(item => JSON.parse(item));

            const createProduct = new ProductModel({
                storeID,
                title,
                desc,
                slug,
                isVariable,
                category,
                variations: variationsData,
                productImage: uploadResult.secure_url,
                galleryImages: imageUrls,
                discountStartsDate: discountStartsDate ? new Date(discountStartsDate) : null,
                discountStartTime: discountStartTime ? new Date(discountStartTime) : null,
                discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
                discountEndTime: discountEndTime ? new Date(discountEndTime) : null,
            });
            await createProduct.save();

            if (io) {
                io.emit('productCreated', { product: createProduct });
            }

            return res.status(201).json({ message: "Product Created Successfully", product: createProduct });
        } else {
            return res.status(400).json({ message: "Invalid Request" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const HandleUpdateProduct = async (req, res, io) => {
    try {
        const { storeID } = req.params;
        const {
            title,
            desc,
            slug,
            isVariable,
            price,
            discountPrice,
            stock,
            category = [],
            variations,
            status,
            netWeight,
            length,
            width,
            height,
            discountStartsDate,
            discountStartTime,
            discountEndDate,
            discountEndTime,
        } = req.body;

        const categories = Array.isArray(category) ? category : [category];

        const findStore = await StoreOwner.findById(storeID);
        if (!findStore) {
            return res.status(404).json({ message: "Store Not Found" });
        }

        const findProduct = await ProductModel.findOne({ slug });
        if (!findProduct) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        const existingSlugProduct = await ProductModel.findOne({
            $or: [{ title }, { slug }],
            _id: { $ne: findProduct._id }
        });
        if (existingSlugProduct) {
            return res.status(400).json({ message: "Slug or Title should be unique" });
        }

        const productImage = req?.files?.productImage;
        const uploadResult = productImage ? await cloudinary.uploader.upload(productImage.tempFilePath, {
            resource_type: 'image',
            folder: `${findStore.storeName} products`
        }) : { secure_url: findProduct.productImage };

        const galleryImages = req?.files?.galleryImages;
        const imageUrls = [];
        if (Array.isArray(galleryImages)) {
            for (const image of galleryImages) {
                const uploadResult = await cloudinary.uploader.upload(image.tempFilePath);
                imageUrls.push(uploadResult.secure_url);
            }
        } else if (galleryImages) {
            const uploadResult = await cloudinary.uploader.upload(galleryImages.tempFilePath);
            imageUrls.push(uploadResult.secure_url);
        }

        const invalidCategoryIDs = [];
        for (const categoryId of categories) {
            const category = await CategoryModel.findById(categoryId) || await SubCatModel.findById(categoryId);
            if (!category) {
                invalidCategoryIDs.push(categoryId);
            }
        }

        if (invalidCategoryIDs.length > 0) {
            return res.status(404).json({ message: `Invalid category IDs: ${invalidCategoryIDs.join(', ')}` });
        }

        findProduct.title = title || findProduct.title;
        findProduct.desc = desc || findProduct.desc;
        findProduct.slug = slug || findProduct.slug;
        findProduct.price = price || findProduct.price;
        findProduct.discountPrice = discountPrice === 'null' ? null : discountPrice || findProduct.discountPrice;
        findProduct.stock = stock || findProduct.stock;
        findProduct.category = categories || findProduct.category;
        findProduct.variations = isVariable === 'true' || isVariable === true ? JSON.parse(variations) : findProduct.variations;
        findProduct.productImage = uploadResult.secure_url || findProduct.productImage;
        findProduct.galleryImages = imageUrls.length > 0 ? imageUrls : findProduct.galleryImages;
        findProduct.status = status || findProduct.status;
        findProduct.netWeight = netWeight || findProduct.netWeight;
        findProduct.length = length || findProduct.length;
        findProduct.width = width || findProduct.width;
        findProduct.height = height || findProduct.height;
        findProduct.discountStartsDate = discountStartsDate ? new Date(discountStartsDate) : findProduct.discountStartsDate;
        findProduct.discountStartTime = discountStartTime ? new Date(discountStartTime) : findProduct.discountStartTime;
        findProduct.discountEndDate = discountEndDate ? new Date(discountEndDate) : findProduct.discountEndDate;
        findProduct.discountEndTime = discountEndTime ? new Date(discountEndTime) : findProduct.discountEndTime;

        await findProduct.save();

        if (io) {
            io.emit('productUpdated', { product: findProduct });
        }

        return res.status(200).json({ message: "Product Updated Successfully", product: findProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export {
    HandleCreateProduct,
    HandleUpdateProduct,
}