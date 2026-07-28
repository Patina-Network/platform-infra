import "./patches";

// there should only be side-effect imports here in order
// to ensure that all resources are picked up by pulumi
import "@/azure";
import "@/github";
import "@/postgres";
import "@/digitalocean";

// add explicit variable outputs to pulumi here (e.g. if you need to be able to see outputs via CLI)
export { azureInitPwsPlaintext } from "@/azure/users";
