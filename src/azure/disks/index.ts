// no longer necessary, but a good example on how to set it up.
// export const k8sDbDataDisk = new azure.compute.Disk(
//   "k8s-db-data-disk",
//   {
//     resourceGroupName: patinaTestingK8sResourceGroup.name,
//     diskName: "k8s-db-data-disk",
//     location: patinaTestingK8sResourceGroup.location,
//     sku: {
//       name: azure.compute.DiskStorageAccountTypes.StandardSSD_LRS,
//     },
//     creationData: {
//       createOption: azure.compute.DiskCreateOption.Empty,
//     },
//     diskSizeGB: 12,
//   },
//   { provider },
// );
