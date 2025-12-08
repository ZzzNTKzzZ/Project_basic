import User from "../Model/User.js";

export default class UserController {
  // GET: /
  static async users(req, res) {
    try {
      const users = await User.find({}).populate();
      return res.json(users);
    } catch (error) {
      console.log(error);
    }
  }

  // GET: /:id
  static async user(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findById(id).populate([
        {
          // Populate fill orderItem
          path: "orders",
          select: "_id orderItems status",
          populate: {
            path: "orderItems",
            select: "quantity variants product",
            populate: {
              path: "product",
              select: "name price image variations",
            },
          },
        },
        {
          path: "cart",
          select: "items",
          populate: {
            path: "items.product",
            select: "name price image variations",
          },
        },
      ]);
      console.log(user)
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // POST: /login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email, password }).populate([
        {
          path: "orders",
          select: "_id orderItems status",
          populate: {
            path: "orderItems",
            select: "quantity variants product",
            populate: {
              path: "product",
              select: "name price image",
            },
          },
        },
        {
          path: "cart",
          select: "items",
          populate: {
            path: "items.product",
            select: "name price image variations",
          },
        },
      ]);

      if (!user) {
        return res.status(404).json({ error: "User not found" }); // handle user not found
      }
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" }); // catch actual server errors
    }
  }

  // POST: /signUp
  static async signUp(req, res) {
    try {
      const { name, email, password } = req.body;

      const user = await User.findOne({ email });
      if (user) {
        return res.status(404).json({ error: "User avaliable" }); // handle exist user
      }

      const newUser = new User({ name, email, password });
      await newUser.save();

      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  // PATCH: /edit/:id
  static async edit(req, res) {
    try {
      const { name, email, phone, dob } = req.body;

      const update = { name, email, phone, dob };
      const id = req.params.id;
      const imagePath = req.file
        ? `/uploads/avatar/${req.file.filename}`
        : null;
      if (req.file) {
        update.image = imagePath;
      }
      const user = await User.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User can't be found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
    }
  }

  // POST: /edit/address/:id
  static async addAddress(req, res) {
    try {
      const { city, ward, addressDetail } = req.body;

      const newAddress = { city, ward, addressDetail, isDefault: false }; //set default address false
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ mess: "Not found User" });
      // Set default first address
      if (user.address.length === 0) {
        newAddress.isDefault = true;
      }

      // Valid avaliable addresses
      const exist = user.address.some((addr) => {
            console.log(newAddress)
            return JSON.stringify(newAddress) === JSON.stringify(addr)}
        ) 
      if (exist) {
        return res.status(200).json({ mess: "Address avaliable" });
      }

      // If isDefault, unset other default addresses
      if (newAddress.isDefault) {
        user.address.forEach((addr) => {
          if (JSON.stringify(newAddress) !== JSON.stringify(addr))
            addr.isDefault = false;
        });
      }

      user.address.push(newAddress);
      await user.save();

      res.status(200).json(user.address);
    } catch (error) {
      console.log(error);
    }
  }

  // DELETE: /delete/address/:id
  static async deleteAddress(req, res) {
    try {
      const { city, ward, addressDetail } = req.body;
      const userId = req.params.id;
      const user = await User.findOne({ _id: userId })


      const indexAddress = user.address.findIndex(
        (addr) =>
          addr.city === city &&
          addr.ward === ward &&
          addr.addressDetail === addressDetail
      );

      user.address.slice(indexAddress, 1);

      // Set default address
      if (user && user.address.length > 0) {
        user.address[0].isDefault = true;
      }

      await user.save();
    } catch (error) {
      console.log(error);
    }
  }
}
