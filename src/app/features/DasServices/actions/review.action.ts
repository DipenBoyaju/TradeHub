// import { requiredAuthUser } from "@/lib/auth-utils";
// import { prisma } from "@/lib/prisma";

// export async function getReviewById(serviceId: string) {

//   const user = await requiredAuthUser()

//   if (!user) {
//     return { success: false, error: "Unauthorized", data: [] };
//   }

//   try {
//     const reviews = await prisma.serviceReview.findMany({
//       where: { serviceId: serviceId },
//       include: {
//         users: {
//           select: {
//             name: true,
//             iamge: true,
//           }
//         }
//       },
//       orderBy: {
//         createdAt: "desc"
//       }
//     });

//     return {
//       success: true,
//       data: reviews
//     };
//   } catch (error) {
//     console.error("Failed to fetch service reviews:", error);
//     return { success: false, error: "Failed to fetch reviews", data: [] };
//   }
// }